import { BarberServicePrice } from "@/constants/service-barber-price";
import { Text, View } from "react-native";
import { stylesModal } from "./ui/confirm-modal";

export function TextSaveConfirmModal({serviceSelected}: {serviceSelected: BarberServicePrice | null}) {
  return (
    <View>
      <Text style={stylesModal.modalText}> <strong>Servicio:</strong> {serviceSelected?.service}</Text>
      <Text style={{...stylesModal.modalText, marginBottom: 10}}> <strong>Precio:</strong> {serviceSelected?.price}</Text>
      <Text style={{...stylesModal.modalText, marginBottom: 10}}> <strong>Metodo de pago:</strong> {serviceSelected?.payMethod}</Text>
    </View>
  )
}