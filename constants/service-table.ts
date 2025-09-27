import { BarberServicePrice } from "./service-barber-price";

export interface ValueFilterInterface {
  name: string;
  label: string;
}

export const NUMBER_DAYS_TO_NEXT = Object.freeze(1);

export const spanishFormatedDate = (date: Date) => {
  return date.toLocaleDateString('es-ES', {
    weekday: 'long',   // lunes, martes, etc.
    year: 'numeric',
    month: 'short',     // enero, febrero, etc.
    day: 'numeric',
  });
}

export const filters: ValueFilterInterface[] = [
    { name: 'all', label: 'Todos' }, 
    { name: 'nequi', label: 'Nequi' }, 
    { name: 'efectivo', label: 'Efectivo' }];

export const servicesByDate = (allService: BarberServicePrice[]): Map<string, BarberServicePrice[]> => {
    const servicesByDateMap: Map<string, BarberServicePrice[]> = new Map();

    allService.forEach(service => {
        const dateKey = new Date(service.date).toDateString();
        if (!servicesByDateMap.has(dateKey)) servicesByDateMap.set(dateKey, [service]);
        else servicesByDateMap.get(dateKey)?.push(service);
    });
    return servicesByDateMap;
}
  
