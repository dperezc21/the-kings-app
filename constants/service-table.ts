 
export interface ValueFilterInterface {
  name: string;
  label: string;
}

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

export const handlePrevious = () => {
    console.log('Flecha ← presionada');
    // Aquí puedes agregar lógica para paginar o cambiar datos
};

export const handleNext = () => {
    console.log('Flecha → presionada');
    // Aquí también lógica para avanzar
};
  
