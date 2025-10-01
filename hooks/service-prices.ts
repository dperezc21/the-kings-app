import { BarberPrice, BarberServicePrice, buttons_value } from "@/constants/service-barber-price";
import { getData, saveData } from "./barber-service-prices";

export default class ServicePrices {
    private pricesByDefault: BarberServicePrice[] = buttons_value.map((item: BarberPrice, index: number) => {
        return {...item, id: index + 1, date: new Date() }
    });

    private readonly storageKey: string = 'prices';

    async getPricesByDefault(): Promise<BarberServicePrice[]> {
        const service = await getData(this.storageKey);
        if(!service) {
            await this.savePricesByDefault(this.pricesByDefault);
            return this.pricesByDefault;
        }
        return service;
    }

    async savePricesByDefault(prices: BarberServicePrice[]) {
        await saveData(this.storageKey, prices);
    }

    async updateServicePrice(updatedPrice: BarberServicePrice) {
        const prices = await getData(this.storageKey);
        if(!prices) return;
        const index = prices.findIndex(price => price.id === updatedPrice.id);  
        if(index !== -1) {
            prices[index] = updatedPrice;
            await saveData(this.storageKey, prices);
        }
    }

    async deleteServicePrice(servicePrice: BarberServicePrice) {
        const prices = await this.getPricesByDefault();
        if(!prices) return;
        const filteredPrices = prices.filter(price => price.id !== servicePrice.id);
        await this.savePricesByDefault(filteredPrices);
    }
}