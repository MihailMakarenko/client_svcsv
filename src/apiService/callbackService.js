import axios from "axios";
import BaseUrl from "./configuration";

class CallbackServerApi {
  constructor() {
    this.baseUrl = `${BaseUrl}/callback`;

    const token = localStorage.getItem("acsessToken");

    this.api = axios.create({
      baseURL: this.baseUrl,
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `${token}` : "", // Добавьте токен, если он есть
      },
    });
  }

  async getIsCallbackForUser(userId) {
    try {
      const response = await this.api.get(`/${userId}`);

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

  async requestCallback(userId) {
    try {
      const response = await this.api.post("/", {
        UserId: userId,
      });
      return response.data;
    } catch (error) {
      if (error.response) {
        // Обработка ошибки, если промокод не найден
        console.error(error.response.data.message);
      } else {
        console.error("Ошибка при запросе рейтинга:", error.message);
      }
    }
  }

  async updateStatusCallback(callbackId) {
    try {
      const response = await this.api.put(`/${callbackId}`);
      return response;
    } catch (error) {
      if (error.response) {
        // Обработка ошибки, если промокод не найден
        console.error(error.response.data.message);
      } else {
        console.error("Ошибка при запросе рейтинга:", error.message);
      }
    }
  }

  async getActiveCallbackWithPagination(page, limit) {
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
}

export default CallbackServerApi;
