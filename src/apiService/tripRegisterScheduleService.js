import axios from "axios";
import BaseUrl from "./configuration";
import RouteService from "./routeServise";
import ScheduleService from "./scheduleService";
import TripServerApi from "./tripService";

class TripRegisterScheduleServerApi {
  constructor() {
    this.baseUrl = `${BaseUrl}/fullInform`;

    const token = localStorage.getItem("acsessToken");
    this.api = axios.create({
      baseURL: this.baseUrl,
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `${token}` : "", // Добавьте токен, если он есть
      },
    });
  }

  async addFormData(formData) {
    try {
      console.log(formData);
      const routeService = new RouteService();
      const scheduleService = new ScheduleService();
      const tripServerApi = new TripServerApi();
      const routeId = await routeService.getRouteIdByCities(
        formData.startCity,
        formData.finishCity
      );
      const trip = await tripServerApi.CreateTrip(formData, routeId);
      if (trip) {
        const response = await scheduleService.createSchedule(
          formData,
          trip.TripId
        );
        console.log(response);
      }
    } catch (error) {
      console.log("ОШИБКА");
    }
  }

  async getFullInformationAboutBus(page, limit) {
    try {
      const response = await this.api.get(`/`, {
        params: {
          page: page,
          limit: limit,
        },
      });
      return response.data; // Предполагаем, что данные находятся в response.data
    } catch (error) {
      console.error(
        "Ошибка при получении информации о автобусе:",
        error.message
      );
      throw new Error("Не удалось получить информацию о автобусе."); // Пробрасываем ошибку дальше
    }
  }
}

export default TripRegisterScheduleServerApi;