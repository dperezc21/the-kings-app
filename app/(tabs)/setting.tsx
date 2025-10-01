import ConfirmModal from "@/components/ui/confirm-modal";
import BarberPriceController from "@/hooks/barber-price.controller";
import React, { useEffect } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

function TextConfirmDelete({textValue}: {textValue: string}) {
    return (
        <Text style={{marginBottom: 10}}>¿Seguro que quiere eliminar <strong>{textValue}</strong>?</Text>
    )
}

const barberPriceController = new BarberPriceController();

export default function Setting() {

    const [modalVisible, setModalVisible] = React.useState<boolean>(false);
    const [doRequest, setDoRequest] = React.useState<boolean>(false);
    const [textModal, setTextModel] = React.useState<string>("");

    const deleteData = async() => {
        let deleteRequest: void;
        if(textModal === "los datos de hoy") deleteRequest = await barberPriceController.deleteServicesByDate(new Date());
        else if(textModal === "todos los datos") deleteRequest = await barberPriceController.deleteAllServicesPrice();
        return deleteRequest;
    }

    useEffect(() => {
        deleteData().then(() => setTextModel("")).finally(() => setDoRequest(false));
    }, [doRequest]);

    return (
        <View style={styles.viewContainer}>
            <Pressable style={styles.button} onPress={() => alert('Settings Screen')}>
                <Text style={styles.text}>Editar precios</Text>
            </Pressable>
            <Pressable style={{...styles.button, ...styles.importanButton}} 
                onPress={() => {setTextModel("los datos de hoy"); setModalVisible(true)}}>
                <Text style={{...styles.text, ...styles.importantTextButton}}>Borrar Datos de hoy</Text>
            </Pressable>
            <Pressable style={{...styles.button, ...styles.warningButton}} 
            onPress={() => {setTextModel("todos los datos"); setModalVisible(true)}}>
                <Text style={{...styles.text, ...styles.warningTextButton}}>Borrar Todo</Text>
            </Pressable>

            <ConfirmModal 
                modalVisible={modalVisible} 
                setModalVisible={setModalVisible}
                sendRequest={setDoRequest} 
                component={ <TextConfirmDelete textValue={textModal} /> }
            />
        </View>
    )
}

const styles = StyleSheet.create({
    viewContainer: {
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center',
        backgroundColor: '#f5f5f5'
    },
    button: {
        marginBottom: 20, 
        padding: 10, 
        backgroundColor: '#ddd', 
        borderRadius: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
        elevation: 5,
        alignItems: 'center',
        justifyContent: 'center',
        width: 200,
    },
    importanButton: {
        color: 'orange',
        backgroundColor: '#fff4e5',
        borderColor: 'orange',
        borderWidth: 1,
    },
    importantTextButton: {
        color: 'orange',
        fontWeight: 'bold',
        letterSpacing: 1,
    },
    warningButton: {
        color: 'red',
        backgroundColor: '#ffcccc',
        borderColor: 'red',
        borderWidth: 1,
    },
    warningTextButton: {
        color: 'red',
        fontWeight: 'bold',
        letterSpacing: 1,
        fontSize: 17,
    },
    text: {
        fontSize: 16, 
        color: '#333',
        fontWeight: 'bold',
        textAlign: 'center',
        letterSpacing: 1,
    }         
})