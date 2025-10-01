import { TextDeleteConfirmModel } from '@/components/text-delete-confirm-model';
import ConfirmModal from '@/components/ui/confirm-modal';
import { BarberServicePrice } from '@/constants/service-barber-price';
import { filters, filterServicesByDate, getNextDay, getPreviousDay, hourFormatDate, servicesByDate, spanishFormatedDate, ValueFilterInterface } from '@/constants/service-table';
import { backGroundColorItemSelected } from '@/constants/styles';
import BarberPriceController from '@/hooks/barber-price.controller';
import { useFocusEffect } from 'expo-router';
import React, { useCallback, useEffect } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const barberPriceController = new BarberPriceController();
      
export default function Explore() {

  const [allService, setAllService] = React.useState<BarberServicePrice[]>([]);
  const [serviceFiltered, setServicesFiltered] = React.useState<BarberServicePrice[]>([]);
  const [dateSelected, setDateSelected] = React.useState<Date>(new Date());
  const [totalValue, setTotalValue] = React.useState<number>(0);
  const [valueFilter, setValueFilter] = React.useState<string>('all');
  const [servicesByDateMap, setServicesByDateMap] = React.useState<Map<string, BarberServicePrice[]>>(new Map());
  const [nextServicesLength, setNextServicesLength] = React.useState<boolean>(true);
  const [previousServicesLength, setPreviousServicesLength] = React.useState<boolean>(true);
  const [sortedServiceDates, setSortedServiceDates] = React.useState<string[]>([]);
  const [itemSelected, setItemSelected] = React.useState<BarberServicePrice | null>(null);
  const [deleteService, setDeleteService] = React.useState(false);
  const [modelVisible, setModalVisible] = React.useState(false);

  const getAllService = async () => {
    let services = await barberPriceController.getServicePrices() as BarberServicePrice[] | null;
    services = services !== null ? services : [];
    const servicesByDateMap: Map<string, BarberServicePrice[]> = servicesByDate(services);
    setServicesByDateMap(servicesByDateMap);
    setAllService(services);
  }

  const handlePrevious = () => {
      const newDate = getPreviousDay(new Date(dateSelected), sortedServiceDates);
      setDateSelected(newDate);
      setServicesFilteredAndTotalValue(newDate);   
  };
  
  const handleNext = () => {
    const newDate = getNextDay(new Date(dateSelected), sortedServiceDates);
    setDateSelected(newDate);
    setServicesFilteredAndTotalValue(newDate);
  };

  const nextDayValid = () => {
    const nextDay = getNextDay(new Date(dateSelected), sortedServiceDates);
    const nextServicesLength = servicesByDateMap.get(nextDay.toDateString())?.length || 0;
    setNextServicesLength(nextServicesLength > 0 || sortedServiceDates?.includes(nextDay.toDateString()));
  }

  const previousDayValid = () => {
    let previousDay = getPreviousDay(new Date(dateSelected), sortedServiceDates);
    const previousServicesLength = servicesByDateMap.get(previousDay.toDateString())?.length || 0;
    setPreviousServicesLength(previousServicesLength > 0 || sortedServiceDates?.includes(previousDay.toDateString()));
  }

  const setServicesFilteredAndTotalValue = (date: Date) => {
    const servicesFiltered = servicesByDateMap.get(date.toDateString()) as BarberServicePrice[];
    setServicesFiltered(servicesFiltered || []);
    setTotalValue(servicesFiltered?.reduce((acc, service) => acc + service.price, 0) || 0);
    setValueFilter('all');
  }

  useFocusEffect(
    useCallback(() => {
      setDateSelected(new Date());
      getAllService();
      setItemSelected(null);
    }, []));

    useEffect(() => { 
      if(deleteService && itemSelected?.id) {
        barberPriceController.deleteServicePrice(itemSelected)
          .then(() => {
            setItemSelected(null);
            setDeleteService(false);
            getAllService();
          })
      }
    }, [deleteService]);

  useEffect(() => {
    if(allService && allService?.length) {
      const services = servicesByDateMap.get(new Date(dateSelected).toDateString()) as BarberServicePrice[];
      setTotalValue(services?.length ? services?.reduce((acc, service) => acc + service.price, 0): 0);
      setServicesFiltered(services);
      let sorted: string[] = Array.from(servicesByDateMap.keys());
      const existsCurrentDate = sorted?.some(date => new Date(date).toDateString() === new Date().toDateString())
      if(!existsCurrentDate) sorted.unshift(new Date().toDateString());
      sorted = sorted.sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
      setSortedServiceDates(sorted);
    }
  }, [allService, servicesByDateMap]);

  useEffect(() => { 
    nextDayValid();
    previousDayValid();
}, [serviceFiltered, dateSelected]);

  useEffect(() => {
    let filteredServices = [];
    if(valueFilter === 'all') filteredServices = filterServicesByDate(dateSelected, allService); 
    else filteredServices = filterServicesByDate(dateSelected, allService).filter(service => service.payMethod === valueFilter);
    setServicesFiltered(filteredServices);
    setTotalValue(filteredServices.reduce((acc, service) => acc + service.price, 0));
  }, [valueFilter]);

  return (
    <View style={styles.container}>

      {/* Contenedor de botones de navegación */}
      <View style={styles.navButtonsContainer}>
        <TouchableOpacity disabled={!previousServicesLength} 
        onPress={handlePrevious} style={styles.navButton}>
          <Text style={styles.navButtonText}>←</Text>
        </TouchableOpacity>

        <TouchableOpacity disabled >
          <Text style={{...styles.navButtonText, ...{ fontSize: 14 }}}>
            {spanishFormatedDate(dateSelected)}</Text>
        </TouchableOpacity>

        <TouchableOpacity disabled={!nextServicesLength}
         onPress={handleNext} style={styles.navButton}>
          <Text style={styles.navButtonText}>→</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.buttonsFilter}>
        {filters.map((filter: ValueFilterInterface) => (
          <TouchableOpacity 
            key={filter.name} 
            onPress={() => setValueFilter(filter.name)} 
            style={{
              ...styles.buttonFilter,
              ...(valueFilter === filter.name ? { backgroundColor: '#74b3f7ff' } : {})
            }}
          >
            <Text style={{
              ...styles.buttonTextFilter,
              ...(valueFilter === filter.name ? { color: 'white' } : {})
            }}>{filter.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
      
      {/* Header fijo */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Servicio</Text>
        <Text style={styles.headerText}>Precio</Text>
        <Text style={styles.headerText}>Pago</Text>
        <Text style={styles.headerText}>Hora</Text>
      </View>

      {/* Scrollable table content */}
      <ScrollView style={styles.scrollContainer}>
        {!serviceFiltered?.length && (
          <Text style={{ textAlign: 'center', marginTop: 20 }}>No hay servicios para esta fecha.</Text>
        )}
        {serviceFiltered?.map((item: BarberServicePrice) => (
          <Pressable onPressIn={() => {setItemSelected(item); setModalVisible(true)}} key={item.id} 
          style={{...styles.row, ...backGroundColorItemSelected(itemSelected?.id as number, item.id, '#e5e8ecff', '')}}>
            <Text style={{...styles.cell, fontWeight: '600'}}>{item.service}</Text>
            <Text style={styles.cell}>{item.price}</Text>
            <Text style={styles.cell}>{item.payMethod}</Text>
            <Text style={styles.cell}>{hourFormatDate(new Date(item.date))}</Text>
          </Pressable>
        ))}
      </ScrollView>

      <ConfirmModal
        modalVisible={modelVisible} 
        setModalVisible={setModalVisible} 
        sendRequest={setDeleteService} 
        component={ itemSelected ? <TextDeleteConfirmModel /> : null }
      ></ConfirmModal>

      {/* Footer fijo */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>Atendidos: {serviceFiltered?.length | 0}</Text>
        <Text style={styles.footerText}>Total{valueFilter !== 'all' ? ' '+valueFilter: ''}:  ${totalValue}</Text>
      </View>
    </View>
  );

}


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  navButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 9,
    backgroundColor: '#F5F5F5',
    marginTop: 10
  },
  navButton: {
    backgroundColor: '#c0d8f1ff',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 5,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  navButtonText: {
    color: 'black',
    fontSize: 18,
    fontWeight: 'medium',
  },
  buttonsFilter: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    padding: 2,
    backgroundColor: '#F5F5F5',
  },
  buttonTextFilter: {
    color: 'black',
    fontSize: 13,
    fontWeight: 'medium',
  },
  buttonFilter: {
    backgroundColor: '#e4e7ebff',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 5,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10,
  },
  header: {
    flexDirection: 'row',
    backgroundColor: '#007AFF',
    padding: 10,
  },
  headerText: {
    flex: 1,
    color: 'white',
    fontWeight: 'bold',
  },
  scrollContainer: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    paddingVertical: 10,
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
    paddingHorizontal: 10,
  },
  cell: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    paddingRight: 5,
    fontFamily: 'bolt-regular',
  },
  footer: {
    padding: 10,
    backgroundColor: '#d6e6f7ff',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  footerText: {
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

