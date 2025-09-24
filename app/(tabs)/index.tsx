import { BarberPrice, buttons_value } from '@/constants/service-barber-price';
import { Pressable, StyleSheet, Text, View } from 'react-native';


export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text>The kings Barber</Text>
      {buttons_value.map((value: BarberPrice) => (
        <Pressable onPress={() => console.log(value)} 
                  key={value.service} style={styles.button_select}  
                  android_ripple={{color: '#ccc'}}>
            <Text style={styles.text_button}>{ value.service }</Text>
        </Pressable>
      ))}      
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
  },
  text_button: {
    display: 'flex', 
    justifyContent: 'center',
    fontFamily: 'bolt-regular',
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
    color: '#000' 
  }
})
