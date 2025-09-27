import { BarberServicePrice } from '@/constants/service-barber-price';
import { filters, handleNext, handlePrevious, spanishFormatedDate, ValueFilterInterface } from '@/constants/service-table';
import BarberPriceController from '@/hooks/barber-price.controller';
import React, { useEffect } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const barberPriceController = new BarberPriceController();

export default function TablaEjemplo() {

  const [allService, setAllService] = React.useState<BarberServicePrice[]>([]);
  const [serviceFiltered, setServicesFiltered] = React.useState<BarberServicePrice[]>([]);
  const [dateSelected, setDateSelected] = React.useState<Date>(new Date());
  const [totalValue, setTotalValue] = React.useState<number>(0);
  const [valueFilter, setValueFilter] = React.useState<string>('all');

  const getAllService = async () => {
    let services = await barberPriceController.getServicePrices() as BarberServicePrice[] | null;
    if(services && services?.length) {
      setAllService(services);
      services = services.filter(service => new Date(service.date).toDateString() === dateSelected.toDateString());
      setServicesFiltered(services);
    }
  }

  const filterByDate = (date: Date) => {
    return allService.filter(service => new Date(service.date).toDateString() === date.toDateString());
  }

  useEffect(() => {
    setDateSelected(new Date());
    getAllService();
  }, []);

  useEffect(() => {
    if(allService && allService?.length) {
      const services = filterByDate(dateSelected);
      setTotalValue(services.reduce((acc, service) => acc + service.price, 0));
      setServicesFiltered(services);
    }
  }, [allService]);

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
        <TouchableOpacity onPress={handlePrevious} style={styles.navButton}>
          <Text style={styles.navButtonText}>←</Text>
        </TouchableOpacity>

        <TouchableOpacity disabled >
          <Text style={{...styles.navButtonText, ...{ fontSize: 14 }}}>{spanishFormatedDate(dateSelected)}</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleNext} style={styles.navButton}>
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
        {serviceFiltered.map((item: BarberServicePrice) => (
          <View key={Math.random()} style={styles.row}>
            <Text style={styles.cell}>{item.service}</Text>
            <Text style={styles.cell}>{item.price}</Text>
            <Text style={styles.cell}>{item.payMethod}</Text>
          </View>
        ))}
      </ScrollView>

      {/* Footer fijo */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>Total{valueFilter !== 'all' ? ' '+valueFilter: ''}:  {totalValue}</Text>
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
    padding: 10,
    backgroundColor: '#F5F5F5',
  },
  navButton: {
    backgroundColor: '#d6e6f7ff',
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
  },
  footer: {
    padding: 10,
    backgroundColor: '#d6e6f7ff',
  },
  footerText: {
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

