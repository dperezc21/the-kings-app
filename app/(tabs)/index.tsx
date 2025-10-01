import { TextSaveConfirmModal } from '@/components/text-save-confirm-modal';
import ConfirmModal from '@/components/ui/confirm-modal';
import { BarberPrice, BarberServicePrice } from '@/constants/service-barber-price';
import { servicesByDate } from '@/constants/service-table';
import { backGroundColorItemSelected, textButton } from '@/constants/styles';
import BarberPriceController from '@/hooks/barber-price.controller';
import ServicePrices from '@/hooks/service-prices';
import { useFocusEffect } from 'expo-router';
import React, { useCallback, useEffect } from 'react';
import { Image, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Snackbar } from 'react-native-paper';

const barberPriceController = new BarberPriceController();
const servicesPrice = new ServicePrices();
export default function HomeScreen() {
  const [serviceSeleted, setServiceSelected] = React.useState<BarberServicePrice | null>(null);
  const [modalVisible, setModalVisible] = React.useState(false);
  const [saveService, setServiceToSave] = React.useState(false);
  const [total, setTotal] = React.useState(0);
  const [allService, setAllService] = React.useState<BarberServicePrice[]>([]);
  const [pricesByDefault, setPricesByDefault] = React.useState<BarberPrice[]>([]);
  const [showSnackBar, setShowSnackBar] = React.useState<boolean>(false);
  const onDismissSnackBar = () => setShowSnackBar(false);
  const onToggleSnackBar = () => setShowSnackBar(!showSnackBar);

  const getAllService = async () => {
    let services = await barberPriceController.getServicePrices() as BarberServicePrice[] | null;
    services = services !== null ? services : [];
    setAllService(services);
    services = services.filter(service => new Date(service.date).toDateString() === new Date().toDateString());
    const totalPrices = services.reduce((acc, service) => acc + service.price, 0);
    setTotal(totalPrices);
    
  }

  const removeServices = async() => {  
    const DAYS_NUMBER_TO_KEEP = 7;
    const serviceByDateMap: Map<string, BarberServicePrice[]>  = servicesByDate(allService);
    const dateList: MapIterator<string> = serviceByDateMap.keys();
    if(Array.from(dateList).length > DAYS_NUMBER_TO_KEEP) {
      let sortedDates = Array.from(serviceByDateMap.keys()).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
      const servicesToKeep = sortedDates.slice(0, DAYS_NUMBER_TO_KEEP).flatMap(date => serviceByDateMap.get(date) || []);    
      await barberPriceController.saveAllServices(servicesToKeep);
    }
  }

  const getPricesByDefault = async () => {
    const prices = await servicesPrice.getPricesByDefault();
    setPricesByDefault(prices);
  }

  useFocusEffect(
      useCallback(() => {
        getAllService();
        getPricesByDefault();
        onDismissSnackBar();
        if(allService.length) removeServices();
      }, []));

  useEffect(() => {
    if(saveService) {
      barberPriceController.saveNewService(serviceSeleted as BarberServicePrice)
        .then(() => {
          setServiceSelected(null);
          setTotal(total + (serviceSeleted?.price || 0));
          setServiceToSave(false);
          onToggleSnackBar();
        })
    }
  }, [saveService]);

  const styleTextButtonSelected = (currentService: string) => ({
    color: serviceSeleted?.service === currentService ? '#fff' : '#000',
  });

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>The last kings</Text>
      <Text style={{...styles.headerText, fontSize: 17}}>BARBER SHOP</Text>
      <Text style={styles.totalText}>Total del dia: {total}</Text>
      <View style={styles.containerButtons}>
      {pricesByDefault.map((value: BarberPrice) => (
        <Pressable onPress={() => { setServiceSelected(value as BarberServicePrice) }} 
                  key={value.service} style={{...styles.button_select, 
                                              ...backGroundColorItemSelected(serviceSeleted?.service as string, value.service) }}  
                  android_ripple={{color: '#ccc'}}>
            <Image source={value?.image} />
            <Text style={{...textButton.style, fontWeight: serviceSeleted?.service === value.service ? '700' : '400', ...styleTextButtonSelected(value.service)}}>{ value.service }</Text>
        </Pressable>
      ))} 
      </View>   
      <ConfirmModal
        modalVisible={modalVisible} 
        setModalVisible={setModalVisible} 
        sendRequest={setServiceToSave} 
        component={ <TextSaveConfirmModal serviceSelected={serviceSeleted} /> }
        />
      
      { serviceSeleted?.service &&
        <View style={styles.payMethodContainer}>
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
        </View> 
      }

      <Snackbar
          visible={showSnackBar}
          onDismiss={onDismissSnackBar}
          duration={1500}
          action={{ label: 'Ok' }}
      > Guardado </Snackbar>
     
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
  },
  button_select: {
    display: 'flex',
    fontFamily: 'bolt-regular',
    fontSize: 16,
    lineHeight: 24,
    width: 100,
    textAlign: 'center',
    padding: 9,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: '#ccc',
    margin: 1,
    justifyContent: 'center',
    alignItems: 'center',
    
  },
  headerText: {
    fontSize: 25,
    fontWeight: '700',
    top: -35,
    marginBottom: 2,
    fontFamily: 'PlayfairDisplay-Bold',
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
    bottom: 35
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
    marginBottom: 10, 
    fontFamily: 'bolt-regular',
    color: '#43405cff'
  }
})
