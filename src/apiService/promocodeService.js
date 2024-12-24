import axios from "axios";
import BaseUrl from "./configuration";

class PromoCodeServerApi {
  constructor() {
    this.baseUrl = `${BaseUrl}/promoCode`;

    const token = localStorage.getItem("acsessToken");

    this.api = axios.create({
      baseURL: this.baseUrl,
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `${token}` : "", // Добавьте токен, если он есть
      },
    });
  }

  async getDiscountByCode(promoCode) {
    try {
      const response = await this.api.get(`/getDiscount/${promoCode}`);
      console.log(response);
      console.log(
        `Скидка по промокоду "${promoCode}": ${response.data.discount}%`
      );
      return response.data.discount;
    } catch (error) {
      if (error.response) {
        // Обработка ошибки, если промокод не найден
        console.error(error.response.data.message);
      } else {
        console.error("Ошибка при запросе скидки:", error.message);
      }
    }
  }
}

export default PromoCodeServerApi;
