import ConfirmModal from '@/components/ui/confirm-modal';
import { BarberPrice, buttons_value } from '@/constants/service-barber-price';
import { textButton } from '@/constants/styles';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';


export default function HomeScreen() {
  const [serviceSeleted, setServiceSelected] = React.useState<BarberPrice | null>(null);
  const [modalVisible, setModalVisible] = React.useState(false);
  return (
    <View style={styles.container}>
      <Text>The kings Barber</Text>
      {buttons_value.map((value: BarberPrice) => (
        <Pressable onPress={() => { setServiceSelected(value); setModalVisible(true); }} 
                  key={value.service} style={styles.button_select}  
                  android_ripple={{color: '#ccc'}}>
            <Text style={textButton.style}>{ value.service }</Text>
        </Pressable>
      ))}    
      <ConfirmModal serviceSeleted={serviceSeleted} modalVisible={modalVisible} setModalVisible={setModalVisible} />
    </View>
  );
}


const styles = StyleSheet.create({   
  container: {
    flex: 1, 
    flexDirection: 'column',
    justifyContent: 'center', 
    alignItems: 'center'
  },
  button_select: {
    display: 'flex',
    fontFamily: 'bolt-regular',
    fontSize: 16,
    lineHeight: 24,
    width: 100,
    textAlign: 'center',
    padding: 17,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: '#ccc',
    margin: 6
  }
})
