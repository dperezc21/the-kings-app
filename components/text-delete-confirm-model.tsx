import { Text, View } from "react-native";
import { stylesModal } from "./ui/confirm-modal";


export function TextDeleteConfirmModel() {
  return (
    <View>
      <Text style={{...stylesModal.modalText, marginBottom: 15, color: 'red'}}>
        ¿Seguro que quiere eliminar este item ?</Text>
    </View>
  )
}