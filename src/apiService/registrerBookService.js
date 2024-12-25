import axios from "axios";
import BaseUrl from "./configuration";

class registerBookServerApi {
  constructor() {
    this.baseUrl = `${BaseUrl}/registerBook`;

    const token = localStorage.getItem("acsessToken");

    this.api = axios.create({
      baseURL: this.baseUrl,
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `${token}` : "", // Добавьте токен, если он есть
      },
    });
  }

  async removeFutureTripsById(tripId) {
    if (!tripId) {
      throw new Error("TripId не указан");
    }

    try {
      const response = await this.api.delete(`/Future/${tripId}`);
      return response.data; // Возвращаем данные ответа, если нужно
    } catch (error) {
      console.error("Ошибка при удалении будущих поездок:", error.message);
      throw new Error("Не удалось удалить будущие поездки");
    }
  }

  async addRegisterBook(formData, tripId, busesNumber) {
    console.log("IIII");
    console.log(busesNumber);
    try {
      const response = await this.api.post(`/addRegisterBook`, {
        FormData: formData,
        TripId: tripId,
        DefaultBusNumber: busesNumber,
      });
      return response.data; // Возвращаем данные ответа, если нужно
    } catch (error) {
      console.error("Ошибка при добавлении в RegisterBook:", error.message);
      throw new Error("Ошибка");
    }
  }
}

export default registerBookServerApi;
