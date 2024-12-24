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
}

export default registerBookServerApi;
