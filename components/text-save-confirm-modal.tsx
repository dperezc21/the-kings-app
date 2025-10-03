import { BarberServicePrice } from "@/constants/service-barber-price";
import { Text, View } from "react-native";
import StrongText from "./strong-text";
import { stylesModal } from "./ui/confirm-modal";

export function TextSaveConfirmModal({serviceSelected}: {serviceSelected: BarberServicePrice | null}) {
  return (
    <View>
      <Text style={stylesModal.modalText}> <StrongText text="Servicio"></StrongText>:  {serviceSelected?.service}</Text>
      <Text style={{...stylesModal.modalText, marginBottom: 10}}><StrongText text="Precio"></StrongText>: {serviceSelected?.price}</Text>
      <Text style={{...stylesModal.modalText, marginBottom: 10}}><StrongText text="Metodo de pago"></StrongText>: {serviceSelected?.payMethod}</Text>
    </View>
  )
}