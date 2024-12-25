import axios from "axios";
import BaseUrl from "./configuration";

class RouteServerApi {
  constructor() {
    this.baseUrl = `${BaseUrl}/route`;

    const token = localStorage.getItem("acsessToken");

    this.api = axios.create({
      baseURL: this.baseUrl,
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `${token}` : "", // Добавьте токен, если он есть
      },
    });
  }

  async getStartFinishCity() {
    try {
      console.log("Запрос на получение городов...");
      const response = await this.api.get(`/getUniqueCities`);
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

  async getRoutes() {
    try {
      console.log("Запрос на получение городов...");
      const response = await this.api.get(`/`);
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

  async getRouteIdByCities(startCity, finishCity) {
    console.log("Мы тут");
    console.log(startCity);
    console.log(finishCity);

    try {
      const response = await this.api.get(
        `/getRouteIdByCities/${encodeURIComponent(
          startCity
        )}/${encodeURIComponent(finishCity)}`
      );
      console.log(response);
      return response.data;
    } catch (error) {
      console.error("Ошибка при получении маршрута:", error);
    }
  }

  async createRoute(startCity, finishCity, distance) {
    try {
      const response = await this.api.post("/", {
        StartCity: startCity,
        FinishCity: finishCity,
        Distance: distance,
      });

      return response.data; // Возвращаем данные, чтобы их можно было использовать в handleSubmit
    } catch (error) {
      throw error; // Пробрасываем ошибку, чтобы её можно было обработать в handleSubmit
    }
  }

  async getAllRoutesWithPagination(page, limit) {
    try {
      const response = await this.api.get("/withPagination", {
        params: {
          Page: page,
          Limit: limit,
        },
      });
      return response.data;
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

  async deleteRoute(routeId) {
    try {
      const response = await this.api.delete(`/${routeId}`);
      return response.data; // Успешный ответ
    } catch (error) {
      // Обработка ошибок
      if (error.response) {
        // Запрос был сделан и сервер ответил со статусом, который выходит за пределы 2xx
        const status = error.response.status;
        const message = error.response.data.message || "Ошибка сервера";
        throw new Error(`${message}`);
      } else if (error.request) {
        // Запрос был сделан, но ответа не было
        throw new Error("Сервер не отвечает");
      } else {
        // Произошла ошибка при настройке запроса
        throw new Error(`Ошибка: ${error.message}`);
      }
    }
  }
}

export default RouteServerApi;
