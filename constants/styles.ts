import { StyleSheet } from "react-native";

export const justityAlignCenter = StyleSheet.create({
  style: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    }
});

export const textButton = StyleSheet.create({
    style: {
        display: 'flex', 
        justifyContent: 'center',
        fontFamily: 'bolt-regular',
        fontSize: 16,
        lineHeight: 24,
        textAlign: 'center',
        color: '#000' 
  }

})