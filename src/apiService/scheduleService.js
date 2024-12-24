import axios from "axios";
import BaseUrl from "./configuration";

class scheduleServerApi {
  constructor() {
    this.baseUrl = `${BaseUrl}/schedule`;

    const token = localStorage.getItem("acsessToken");

    this.api = axios.create({
      baseURL: this.baseUrl,
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `${token}` : "", // Добавьте токен, если он есть
      },
    });
  }

  async getExelSchedule(startCity, finishCity) {
    try {
      console.log("Запрос на получение Exel...");
      const response = await this.api.get(`/downloadSchedule`, {
        params: {
          startCity: startCity,
          finishCity: finishCity,
        },
        responseType: "blob",
      });

      console.log("IIIIIIIIIIIIIIII");

      return response; // Возвращаем ответ
    } catch (error) {
      let errorMessage;
      if (error.response) {
        errorMessage = "Ошибка скачивания билета";
      } else {
        errorMessage = "Произошла ошибка";
      }
      console.error(errorMessage);
      throw new Error(errorMessage); // Пробрасываем ошибку
    }
  }

  async getTicetByUserId(userId, successCallback, errorCallback) {
    try {
      console.log("Мы тут");
      const response = await this.api.get(`/getTicketsForUser/${userId}`);
      console.log(response);

      if (successCallback) {
        successCallback("Билеты получены");
      }
      return response; // Возвращаем данные, чтобы их можно было использовать в handleSubmit
    } catch (error) {
      if (error.response) {
        if (errorCallback) {
          errorCallback("Ошибка получения билетов");
        }
      } else {
        if (errorCallback) {
          errorCallback("Произошла ошибка");
        }
      }
      throw error; // Пробрасываем ошибку, чтобы её можно было обработать в handleSubmit
    }
  }

  async createSchedule(data, tripId) {
    try {
      const response = await this.api.post("/", {
        Monday: data.Monday,
        Wednesday: data.Wednesday,
        Thursday: data.Thursday,
        Friday: data.Friday,
        Saturday: data.Saturday,
        Sunday: data.Sunday,
        TripId: tripId,
      });

      return response.data; // Возвращаем данные, чтобы их можно было использовать в handleSubmit
    } catch (error) {
      throw error; // Пробрасываем ошибку, чтобы её можно было обработать в handleSubmit
    }
  }

  async setFalseShedule(scheduleId) {
    try {
      const response = await this.api.put(`/${scheduleId}`, {
        Monday: false,
        Wednesday: false,
        Tuesday: false,
        Friday: false,
        Saturday: false,
        Sunday: false,
        Thursday: false,
        TripId: false,
      });

      return response.data; // Возвращаем данные, чтобы их можно было использовать в handleSubmit
    } catch (error) {
      throw error; // Пробрасываем ошибку, чтобы её можно было обработать в handleSubmit
    }
  }
}

export default scheduleServerApi;
