import AsyncStorage from '@react-native-async-storage/async-storage';
//import AsyncStorage from '@react-native-async-storage/async-storage';

import { BarberServicePrice } from "@/constants/service-barber-price";
import { Platform } from "react-native";

const isWeb = Platform.OS === 'web';

export async function saveData(key: string, value: BarberServicePrice[]) {
  const jsonValue = JSON.stringify(value);
  if (isWeb) {
    localStorage.setItem(key, jsonValue);
  } else {
    await AsyncStorage.setItem(key, jsonValue);
  }
}

export async function getData(key: string): Promise<BarberServicePrice[] | null> {
    if (isWeb) {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
    } else {
        const jsonValue = await AsyncStorage.getItem(key);
        return jsonValue != null ? JSON.parse(jsonValue) : null;
    }
}