import { BarberServicePrice } from '@/constants/service-barber-price';
import { filters, NUMBER_DAYS_TO_NEXT, servicesByDate, spanishFormatedDate, ValueFilterInterface } from '@/constants/service-table';
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

  const getAllService = async () => {
    let services = await barberPriceController.getServicePrices() as BarberServicePrice[] | null;
    if(services && services?.length) {
      const servicesByDateMap = servicesByDate(services);
      setServicesByDateMap(servicesByDateMap);
      setAllService(services);
    }
  }

  const filterByDate = (date: Date) => {
    return allService.filter(service => new Date(service.date).toDateString() === date.toDateString());
  }

  const handlePrevious = () => {
      const newDate = new Date(dateSelected);
      newDate.setDate(newDate.getDate() - NUMBER_DAYS_TO_NEXT);
      setDateSelected(newDate);
      setServicesFilteredAndTotalValue(newDate);   
  };
  
  const handleNext = () => {
    const newDate = new Date(dateSelected);
    newDate.setDate(newDate.getDate() + NUMBER_DAYS_TO_NEXT);
    setDateSelected(newDate);
    setServicesFilteredAndTotalValue(newDate);
  };

  const setServicesFilteredAndTotalValue = (date: Date) => {
    const servicesFiltered = servicesByDateMap.get(date.toDateString()) as BarberServicePrice[];
    setServicesFiltered(servicesFiltered || []);
    setTotalValue(servicesFiltered?.reduce((acc, service) => acc + service.price, 0) || 0);
    setValueFilter('all');
  }

  const nextDayValid = () => {
    const nextDay = new Date(dateSelected);
    nextDay.setDate(nextDay.getDate() + NUMBER_DAYS_TO_NEXT);
    const nextServicesLength = servicesByDateMap.get(nextDay.toDateString())?.length || 0;
    setNextServicesLength(nextServicesLength > 0 || sortedServiceDates?.includes(nextDay.toDateString()));
  }

  const previousDayValid = () => {
    const previousDay = new Date(dateSelected);
    previousDay.setDate(previousDay.getDate() - NUMBER_DAYS_TO_NEXT);
    const previousServicesLength = servicesByDateMap.get(previousDay.toDateString())?.length || 0;
    setPreviousServicesLength(previousServicesLength > 0 || sortedServiceDates?.includes(previousDay.toDateString()));
  }

  useFocusEffect(
    useCallback(() => {
      setDateSelected(new Date());
      getAllService();
    }, [])
);

  useEffect(() => {
    if(allService && allService?.length) {
      const services = servicesByDateMap.get(new Date(dateSelected).toDateString()) as BarberServicePrice[];
      setTotalValue(services?.length ? services?.reduce((acc, service) => acc + service.price, 0): 0);
      setServicesFiltered(services);
      const sorted: string[] = Array.from(servicesByDateMap.keys());
      const existsCurrentDate = sorted?.some(date => new Date(date).toDateString() === new Date().toDateString())
      if(!existsCurrentDate) sorted.unshift(new Date().toDateString());
      setSortedServiceDates(sorted);
    }
  }, [allService, servicesByDateMap]);

  useEffect(() => { 
    nextDayValid();
    previousDayValid();
}, [serviceFiltered, dateSelected]);

  useEffect(() => {
    let filteredServices = [];
    if(valueFilter === 'all') filteredServices = filterByDate(dateSelected); 
    else filteredServices = filterByDate(dateSelected).filter(service => service.payMethod === valueFilter);
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
        <Text style={styles.headerText}>Tipo de Pago</Text>
      </View>

      {/* Scrollable table content */}
      <ScrollView style={styles.scrollContainer}>
        {!serviceFiltered?.length && (
          <Text style={{ textAlign: 'center', marginTop: 20 }}>No hay servicios para esta fecha.</Text>
        )}
        {serviceFiltered?.map((item: BarberServicePrice) => (
          <Pressable onPressOut={() => setItemSelected(null)} 
          onPressIn={() => setItemSelected(item)} key={item.service} 
          style={{...styles.row, ...backGroundColorItemSelected(itemSelected?.service as string, item.service, '#cbd4e0ff', '')}}>
            <Text style={{...styles.cell, fontWeight: '600'}}>{item.service}</Text>
            <Text style={styles.cell}>{item.price}</Text>
            <Text style={styles.cell}>{item.payMethod}</Text>
          </Pressable>
        ))}
      </ScrollView>

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

