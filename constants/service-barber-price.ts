export interface BarberPrice {
  service: string;
  price: number;
}

export const buttons_value: BarberPrice[] = [
  {service: 'Adultos', price: 2000}, 
  {service: 'Niños', price: 1500},
  {service: 'Afeitado', price: 1000},
  {service: 'Cejas', price: 2000}
];