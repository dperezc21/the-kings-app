import { BarberServicePrice } from "@/constants/service-barber-price";
import { textButton } from "@/constants/styles";
import ServicePrices from "@/hooks/service-prices";
import React, { useEffect } from "react";
import { FlatList, Pressable, StyleSheet, Text, TextInput, View } from "react-native";

const servicesPrice = new ServicePrices();

export default function EditServices({setEditPrices}: {setEditPrices: (edit: boolean) => void}) {

    const [servicePriceList, setServicesPriceList] = React.useState<BarberServicePrice[]>([]);

    const getPrices = async() => {
        const getServicesPrice = await servicesPrice.getPricesByDefault();
        setServicesPriceList(getServicesPrice);
    }

    const handlePriceChange = (index: number, newPrice: string) => {
        const updated = [...servicePriceList];
        updated[index].price = parseFloat(newPrice) || 0;
        setServicesPriceList(updated);
    };

    const handleSubmit = () => {
        servicesPrice.savePricesByDefault(servicePriceList).then(() => {
            setEditPrices(false);
        });
    };
    useEffect(() => {
        getPrices();
    }, []);

    return (
    <View style={styles.container}>
      <FlatList
        data={servicePriceList}
        keyExtractor={(item) => item.service}
        renderItem={({ item, index }) => (
          <View style={styles.row}>
            <Text style={styles.label}>{item.service}</Text>
            <TextInput
              style={styles.input}
              value={String(item.price)}
              onChangeText={(text) => handlePriceChange(index, text)}
              keyboardType="numeric"
              placeholder="Price"
            />
          </View>
        )}
      />

        <View style={{display: 'flex', flexDirection: 'row'}}>
            <Pressable style={styles.button}
                onPress={() => {setEditPrices(false)}}>
                <Text style={textButton.style}>Cancelar</Text>
            </Pressable>

            <Pressable style={{...styles.button, backgroundColor: '#938ccaff'}}
                onPress={handleSubmit}>
                <Text style={{...textButton.style, fontWeight: '600'}}>Actualizar</Text>
            </Pressable>
        </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    justifyContent: 'space-between',
  },
  label: {
    fontSize: 16,
    flex: 1,
    fontFamily: 'bolt-regular',
    fontWeight: '600'
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    width: 100,
    textAlign: 'right',
  },
  button: {
    margin: 20, 
    padding: 5, 
    backgroundColor: '#ddd', 
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    alignItems: 'center',
    justifyContent: 'center',
    width: 100,
    },
});