import EditServices from "@/components/edit-services";
import StrongText from "@/components/strong-text";
import ConfirmModal from "@/components/ui/confirm-modal";
import BarberPriceController from "@/hooks/barber-price.controller";
import { useFocusEffect } from "expo-router";
import React, { useCallback, useEffect } from "react";
import { Pressable, StatusBar, StyleSheet, Text, View } from "react-native";

import { Snackbar } from 'react-native-paper';

function TextConfirmDelete({textValue}: {textValue: string}) {
    return (
        <Text style={{marginBottom: 10}}>¿Seguro que quiere eliminar <StrongText text={textValue}></StrongText>?</Text>
    )
}

const barberPriceController = new BarberPriceController();

export default function Setting() {

    const [modalVisible, setModalVisible] = React.useState<boolean>(false);
    const [doRequest, setDoRequest] = React.useState<boolean>(false);
    const [textModal, setTextModel] = React.useState<string>("");
    const [showSnackBar, setShowSnackBar] = React.useState<boolean>(false);
    const onDismissSnackBar = () => setShowSnackBar(false);
    const onToggleSnackBar = () => setShowSnackBar(!showSnackBar);
    const [editPrices, setEditPrices] = React.useState<boolean>(false);
    const textToday = "los datos de hoy";
    const textAll = "todos los datos";

    const deleteData = async() => {
        let deleteRequest: void;
        if(textModal === textToday) deleteRequest = await barberPriceController.deleteServicesByDate(new Date());
        else if(textModal === textAll) deleteRequest = await barberPriceController.deleteAllServicesPrice();
        return deleteRequest;
    }

    useFocusEffect(
        useCallback(() => {
            onDismissSnackBar();
            setEditPrices(false);
    }, []));

    useEffect(() => {
        if(doRequest) {
            deleteData().then(() => {
                setTextModel("");
                onToggleSnackBar();
            }).finally(() => setDoRequest(false));
        }
    }, [doRequest]);

    return (
        <View style={styles.viewContainer}>
            <StatusBar barStyle={'dark-content'} backgroundColor={'#9c9999ff'} hidden={true} />
            {!editPrices && 
            <View>
                <Pressable style={styles.button} onPress={() => setEditPrices(true)}>
                    <Text style={styles.text}>Editar precios</Text>
                </Pressable>
                <Pressable style={{...styles.button, ...styles.importanButton}} 
                    onPress={() => {setTextModel(textToday); setModalVisible(true)}}>
                    <Text style={{...styles.text, ...styles.importantTextButton}}>Borrar Datos de hoy</Text>
                </Pressable>
                <Pressable style={{...styles.button, ...styles.warningButton}} 
                onPress={() => {setTextModel(textAll); setModalVisible(true)}}>
                    <Text style={{...styles.text, ...styles.warningTextButton}}>Borrar Todo</Text>
                </Pressable>
            </View>}

            <ConfirmModal 
                modalVisible={modalVisible} 
                setModalVisible={setModalVisible}
                sendRequest={setDoRequest} 
                component={ <TextConfirmDelete textValue={textModal} /> }
            />
            <Snackbar
                visible={showSnackBar}
                onDismiss={onDismissSnackBar}
                duration={1500}
                action={{ label: 'Ok' }}
            > Datos Eliminados </Snackbar>

            {editPrices && 
                <EditServices setEditPrices={setEditPrices}></EditServices>
            }
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