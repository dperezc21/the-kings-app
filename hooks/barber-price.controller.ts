import { BarberServicePrice } from "@/constants/service-barber-price";
import { getData, saveData } from "./barber-service-prices";

export default class BarberPriceController {

    async setServicePrice(servicePrice: BarberServicePrice) {
        servicePrice.date = new Date();
        const prices = await this.getServicePrices() || [];
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

}