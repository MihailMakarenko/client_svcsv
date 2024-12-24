import axios from "axios";
import BaseUrl from "./configuration";
import RouteService from "./routeServise";
import ScheduleService from "./scheduleService";

class TripServerApi {
  constructor() {
    this.baseUrl = `${BaseUrl}/trips`;

    const token = localStorage.getItem("acsessToken");
    this.api = axios.create({
      baseURL: this.baseUrl,
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `${token}` : "", // Добавьте токен, если он есть
      },
    });
  }

  async CreateTrip(formData, routeId) {
    console.log(formData);
    try {
      const trip = await this.api.post("/", {
        RouteId: routeId, // предполагается, что RouteId передается в formData
        StartTime: formData.startTime,
        FinishTime: formData.finishTime,
        Price: formData.price,
      });
      console.log("Создана поездка:", trip.data); // выводим только данные ответа
      return trip.data; // возвращаем данные поездки
    } catch (error) {
      console.error("Ошибка при создании поездки:", error.message);
      if (error.response) {
        console.error("Ответ сервера:", error.response.data);
      }
    }
  }
}

export default TripServerApi;
