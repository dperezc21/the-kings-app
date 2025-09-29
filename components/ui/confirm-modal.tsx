import { BarberServicePrice } from "@/constants/service-barber-price";
import { justityAlignCenter, textButton } from "@/constants/styles";
import React from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";

interface ConfirmModalProps<T> {
  serviceSeleted: T | null;
  modalVisible: boolean;
  setModalVisible: (visible: boolean) => void;
  sendRequest: (boolean: boolean) => void;
}

export default function ConfirmModal({serviceSeleted, modalVisible, setModalVisible, sendRequest }: ConfirmModalProps<BarberServicePrice>) {

  return (
    <Modal 
        animationType="slide" // or "fade", "none"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
    >
        <View style={stylesModal.centeredView}>
            <View style={stylesModal.modalView}>
            <Text style={stylesModal.modalText}> <strong>Servicio:</strong> {serviceSeleted?.service}</Text>
            <Text style={{...stylesModal.modalText, marginBottom: 10}}> <strong>Precio:</strong> {serviceSeleted?.price}</Text>
            <View style={stylesModal.containerButtons}>
            <Pressable onPress={() => { setModalVisible(false); sendRequest(false)}} 
                    style={stylesModal.button}  >
                <Text style={textButton.style}>Cancelar</Text>
            </Pressable>
            <Pressable onPress={() => { setModalVisible(false); sendRequest(true)}} 
                    style={{...stylesModal.button, ...stylesModal.buttonAccept}}  >
                <Text style={{...textButton.style, ...stylesModal.textButtonAccept}}>Aceptar</Text>
            </Pressable>
            </View>
            </View>
        </View>
    </Modal>  
  );
}


export const stylesModal = StyleSheet.create({
  container: {
    ...justityAlignCenter.style
  },
  centeredView: {
    ...justityAlignCenter.style,
    backgroundColor: 'rgba(0,0,0,0.5)', // Semi-transparent background
  },
  modalView: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    elevation: 5, // Android shadow
  },
  modalText: {
    marginBottom: 1,
    textAlign: 'center',
  },
  containerButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  button: { 
    textAlign: 'center',
    marginHorizontal: 10,
    flex: 1,
    margin: 5,
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#cccfd1ff',
  },
  buttonAccept: { 
    backgroundColor: '#706c99ff',
  },
  textButtonAccept: { 
    color: '#000',
    fontWeight: '800',
    fontSize: 16,
  }
});