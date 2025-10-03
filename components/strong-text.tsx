import { Text } from "react-native";

export default function StrongText({text}: {text: string}) {
  return <Text style={{fontWeight: 600}}>{text}</Text>
}