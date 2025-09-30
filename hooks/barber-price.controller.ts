import { BarberServicePrice } from "@/constants/service-barber-price";
import { getData, saveData } from "./barber-service-prices";

export default class BarberPriceController {

    async saveAllServices(services: BarberServicePrice[]) {
      await saveData('prices', services);
    }

    async saveNewService(servicePrice: BarberServicePrice) {
        servicePrice.date = new Date();
        const prices = await this.getServicePrices() || [];
        servicePrice.id = prices.length ? Math.max(...prices.map(p => p.id)) + 1 : 1;
        if(prices.length === 0){
            await saveData('prices', [servicePrice]);
            return;
        }
        prices.push(servicePrice);
        await saveData('prices', prices);
    }

    getServicePrices(): Promise<BarberServicePrice[] | null> {
        return getData('prices');
    }

    async deleteServicePrice(servicePrice: BarberServicePrice) {
        const services: BarberServicePrice[] | null = await this.getServicePrices();
        const servicesFiltered: BarberServicePrice[] = services?.filter(value => value.service !== servicePrice.service) as BarberServicePrice[];
        await this.saveAllServices(servicesFiltered);
    }

}