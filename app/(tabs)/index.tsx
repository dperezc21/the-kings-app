import ConfirmModal from '@/components/ui/confirm-modal';
import { BarberPrice, BarberServicePrice, buttons_value } from '@/constants/service-barber-price';
import { textButton } from '@/constants/styles';
import BarberPriceController from '@/hooks/barber-price.controller';
import React, { useEffect } from 'react';
import { Image, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const barberPriceController = new BarberPriceController();
export default function HomeScreen() {
  const [serviceSeleted, setServiceSelected] = React.useState<BarberServicePrice | null>(null);
  const [modalVisible, setModalVisible] = React.useState(false);
  const [serviceSaved, setServiceSaved] = React.useState(false);
  const [total, setTotal] = React.useState(0);
  const [, setAllService] = React.useState<BarberServicePrice[]>([]);

  const getAllService = async () => {
    let services = await barberPriceController.getServicePrices() as BarberServicePrice[] | null;
    if(services && services?.length) {
      setAllService(services);
      services = services.filter(service => new Date(service.date).toDateString() === new Date().toDateString());
      const totalPrices = services.reduce((acc, service) => acc + service.price, 0);
      setTotal(totalPrices);
    }
  }

  useEffect(() => {
    getAllService();
  }, []);

  useEffect(() => {
    if(serviceSaved) {
      setServiceSelected(null);
      setTotal(total + (serviceSeleted?.price || 0));
      setServiceSaved(false);
    }
  }, [serviceSaved]);

  const getBackGroundColorServiceSelected = (currentService: string) => ({
    backgroundColor: serviceSeleted?.service === currentService ? '#5E5A80' : '#dcdcdfff',
  });

  const styleTextButtonSelected = (currentService: string) => ({
    color: serviceSeleted?.service === currentService ? '#fff' : '#000',
  });

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>The kings Barber</Text>
      <Text style={styles.totalText}>Total del dia: {total}</Text>
      <View style={styles.containerButtons}>
      {buttons_value.map((value: BarberPrice) => (
        <Pressable onPress={() => { setServiceSelected(value as BarberServicePrice) }} 
                  key={value.service} style={{...styles.button_select, ...getBackGroundColorServiceSelected(value.service) }}  
                  android_ripple={{color: '#ccc'}}>
            <Text style={{...textButton.style, fontWeight: serviceSeleted?.service === value.service ? '700' : '400', ...styleTextButtonSelected(value.service)}}>{ value.service }</Text>
        </Pressable>
      ))} 
      </View>   
      <ConfirmModal 
        serviceSeleted={serviceSeleted} 
        modalVisible={modalVisible} 
        setModalVisible={setModalVisible} 
        saved={setServiceSaved} />
      
      { serviceSeleted?.price &&
        <view style={styles.payMethodContainer}>
        <TouchableOpacity onPress={() => {setServiceSelected({...serviceSeleted, payMethod: 'efectivo'}); setModalVisible(true) }} 
            style={{ ...styles.payMethodButton, borderColor: serviceSeleted.payMethod === 'efectivo' ? 'blue' : 'transparent' }}>
          <Image source={require('../../assets/images/pago.png')} style={styles.widthHeight} />
          <Text>Efectivo</Text>
        </TouchableOpacity> 

          <TouchableOpacity onPress={() => {setServiceSelected({...serviceSeleted, payMethod: 'nequi'}); setModalVisible(true) }} 
             style={{ ...styles.payMethodButton, borderColor: serviceSeleted.payMethod === 'nequi' ? 'blue' : 'transparent' }}>
            <Image source={require('../../assets/images/pago-movil.png')} style={styles.widthHeight} />
          <Text>Nequi</Text>
          </TouchableOpacity> 
        </view> 
      }
     
    </View>
  );
}


const styles = StyleSheet.create({   
  containerButtons: {
      display: 'flex',
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'center',
      gap: 10,
      padding: 5,
      width: '100%'
  },
  container: {
    flex: 1, 
    flexDirection: 'column',
    justifyContent: 'center', 
    alignItems: 'center',
    backgroundColor: '#F3E8FF'
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
  headerText: {
    fontSize: 25,
    fontWeight: '700',
    top: -50,
    marginBottom: 20,
    fontFamily: 'bolt-regular',
    color: '#b1980cff'
  },
  payMethodContainer: { 
    display: 'flex', 
    justifyContent: 'center', 
    flexDirection: 'row', 
    height: 40, 
    width: '50%', 
    marginTop: 20,
    gap: 20,
    position: 'absolute',
    bottom: 80
  },
  payMethodButton: {
    display: 'flex', 
    flexDirection: 'row', 
    marginTop: 10,
    borderWidth: 1, 
    borderRadius: 5, 
    padding: 4
  },
  widthHeight: { width: 30, height: 30 },
  totalText: { 
    fontSize: 20, 
    fontWeight: '600', 
    marginBottom: 20, 
    fontFamily: 'bolt-regular',
    color: '#43405cff'
  }
})
