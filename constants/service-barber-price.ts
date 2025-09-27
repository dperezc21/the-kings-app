export interface BarberPrice {
  service: string;
  price: number;
  image?: any;
}

export const buttons_value: BarberPrice[] = [
  {service: 'Adultos', price: 2000, image: require('../assets/images/hombre.png')}, 
  {service: 'Niños', price: 1500, image: require('../assets/images/chico.png')},
  {service: 'Barba', price: 1000, image: require('../assets/images/bigote-con-barba.png')},
  {service: 'Cejas', price: 2000, image: require('../assets/images/ceja.png')},
];

export type BarberServicePrice = Omit<BarberPrice, 'image'> & {
  date: Date,
  payMethod?: string,
}