import axios from "axios";
import BaseUrl from "./configuration";

class BusesServerApi {
  constructor() {
    this.baseUrl = `${BaseUrl}/buses`;

    const token = localStorage.getItem("acsessToken");

    this.api = axios.create({
      baseURL: this.baseUrl,
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `${token}` : "", // Добавьте токен, если он есть
      },
    });
  }

  async getAvailableBuses(startCity, finishCity, date) {
    try {
      console.log("Запрос на получение доступных поездок...");
      const response = await this.api.get(`/getBusesOnDate`, {
        params: {
          startCity: startCity,
          finishCity: finishCity,
          date: date,
        },
      });

      return response; // Возвращаем ответ
    } catch (error) {
      let errorMessage;
      if (error.response) {
        errorMessage = "Ошибка получения";
      } else {
        errorMessage = "Произошла ошибка";
      }
      console.error(errorMessage);
      throw new Error(errorMessage); // Пробрасываем ошибку
    }
  }

  async getAllBuses() {
    try {
      console.log("Запрос на получение доступных поездок...");
      const response = await this.api.get(`/`);
      return response.data; // Возвращаем ответ
    } catch (error) {
      let errorMessage;
      if (error.response) {
        errorMessage = "Ошибка получения";
      } else {
        errorMessage = "Произошла ошибка";
      }
      console.error(errorMessage);
      throw new Error(errorMessage); // Пробрасываем ошибку
    }
  }

  async getAllBusesWithPagination(page, limit) {
    try {
      console.log("Запрос на получение доступных поездок...");
      const response = await this.api.get(`/withPagination`, {
        params: {
          Page: page,
          Limit: limit,
        },
      });
      return response.data; // Возвращаем ответ
    } catch (error) {
      let errorMessage;
      if (error.response) {
        errorMessage = "Ошибка получения";
      } else {
        errorMessage = "Произошла ошибка";
      }
      console.error(errorMessage);
      throw new Error(errorMessage); // Пробрасываем ошибку
    }
  }

  async createBuse(busesNumber, busModel, carrier, capacity) {
    try {
      const response = await this.api.post("/", {
        BusNumber: busesNumber,
        NameCompany: carrier,
        Model: busModel,
        Capacity: capacity,
      });

      return response.data; // Возвращаем данные, чтобы их можно было использовать в handleSubmit
    } catch (error) {
      throw error; // Пробрасываем ошибку, чтобы её можно было обработать в handleSubmit
    }
  }
}

export default BusesServerApi;
