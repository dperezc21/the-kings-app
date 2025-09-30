export interface BarberPrice {
  service: string;
  price: number;
  image?: any;
}

export const buttons_value: BarberPrice[] = [
  {service: 'Adultos', price: 14000, image: require('../assets/images/hombre.png')},
  {service: 'Adultos con Barba', price: 17000, image: require('../assets/images/barba.png')}, 
  {service: 'Niños', price: 13000, image: require('../assets/images/chico.png')},
  {service: 'Barba', price: 7000, image: require('../assets/images/bigote-con-barba.png')},
  {service: 'Cejas', price: 3000, image: require('../assets/images/ceja.png')},
  {service: 'Cerquillos', price: 3000, image: require('../assets/images/comercio.png')},
];

export type BarberServicePrice = Omit<BarberPrice, 'image'> & {
  id: number,
  date: Date,
  payMethod?: string,
}