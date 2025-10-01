import { BarberServicePrice } from "@/constants/service-barber-price";
import { getData, saveData } from "./barber-service-prices";

export default class BarberPriceController {
    private readonly storageKey: string = 'services';

    async saveAllServices(services: BarberServicePrice[]) {
      await saveData('services', services);
    }

    async saveNewService(servicePrice: BarberServicePrice) {
        servicePrice.date = new Date();
        const prices = await this.getServicePrices() || [];
        servicePrice.id = prices.length ? Math.max(...prices.map(p => p.id)) + 1 : 1;
        if(prices.length === 0){
            await this.saveAllServices([servicePrice]);
            return;
        }
        prices.push(servicePrice);
        await this.saveAllServices(prices);
    }

    getServicePrices(): Promise<BarberServicePrice[] | null> {
        return getData(this.storageKey);
    }

    async deleteServicePrice(servicePrice: BarberServicePrice) {
        const services: BarberServicePrice[] | null = await this.getServicePrices();
        const servicesFiltered: BarberServicePrice[] = services?.filter(value => value.service !== servicePrice.service) as BarberServicePrice[];
        await this.saveAllServices(servicesFiltered);
    }

    async deleteAllServicesPrice(): Promise<void> {
        await this.saveAllServices([]);
    }

    async deleteServicesByDate(date: Date): Promise<void> {
        const allServices: BarberServicePrice[] =await  this.getServicePrices() as BarberServicePrice[];
        const servicesPricesToKeep = allServices.filter((value: BarberServicePrice) => new Date(value.date).toDateString() !== new Date(date).toDateString());
        await this.saveAllServices(servicesPricesToKeep);
    }

}