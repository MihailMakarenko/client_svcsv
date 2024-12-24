import { Email, Password } from "@mui/icons-material";
import axios from "axios";
import BaseUrl from "./configuration";

class UserServerApi {
  constructor() {
    this.baseUrl = `${BaseUrl}/user`;

    const token = localStorage.getItem("acsessToken");

    this.api = axios.create({
      baseURL: this.baseUrl,
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `${token}` : "", // Добавьте токен, если он есть
      },
    });
  }

  async addPerson(user, successCallback, errorCallback) {
    console.log(user);
    try {
      const response = await this.api.post("/", {
        FirstName: user.firstName,
        LastName: user.lastName,
        Email: user.email,
        PhoneNumber: user.phone,
        Password: user.password,
        isGetNotifications: user.isGetNotification,
        isGetNewsletter: user.isGetNewsletter,
        Role: "",
      });

      if (successCallback) {
        successCallback("Поздравляю, вы зарегистрированы!!!!");
      }
      return response.data; // Возвращаем данные, чтобы их можно было использовать в handleSubmit
    } catch (error) {
      if (error.response) {
        if (errorCallback) {
          errorCallback("Ошибка регистрации");
        }
      } else {
        if (errorCallback) {
          errorCallback("Произошла ошибка");
        }
      }
      throw error; // Пробрасываем ошибку, чтобы её можно было обработать в handleSubmit
    }
  }

  async loginUser(email, password, successCallback, errorCallback) {
    console.log(email);
    console.log(password);
    try {
      const response = await this.api.get("/login", {
        params: {
          Email: email,
          Password: password,
        },
      });

      // Вызываем successCallback только после получения ответа
      if (successCallback) {
        successCallback("Вход выполнен успешно");
      }

      return response.data; // Возвращаем данные для использования в handleSubmit
    } catch (error) {
      const errorMessage = error.response
        ? error.response.data.message || "Ошибка при входе"
        : "Произошла ошибка сервера";

      if (errorCallback) {
        errorCallback(errorMessage); // Передаем сообщение об ошибке
      }

      throw new Error(errorMessage); // Пробрасываем ошибку для обработки в handleSubmit
    }
  }

  async changeNotification(id, notification) {
    try {
      const response = await this.api.put(`/${id}`, {
        // Убираем body
        isGetNotifications: notification, // Объект передаем напрямую
      });

      return response.data; // Возвращаем данные после успешного изменения
    } catch (error) {
      const errorMessage = error.response
        ? error.response.data.message || "Ошибка при обновлении"
        : "Произошла ошибка сервера";

      console.error("Ошибка при изменении уведомления:", errorMessage); // Логируем ошибку
      throw new Error(errorMessage); // Пробрасываем ошибку для обработки в handleSubmit
    }
  }

  async changeNews(id, isGetNews) {
    try {
      const response = await this.api.put(`/${id}`, {
        isGetNewsletter: isGetNews,
      });

      // Вызываем successCallback только после получения ответа

      return response.data; // Возвращаем данные для использования в handleSubmit
    } catch (error) {
      const errorMessage = error.response
        ? error.response.data.message || "Ошибка при обновлении"
        : "Произошла ошибка сервера";

      throw new Error(errorMessage); // Пробрасываем ошибку для обработки в handleSubmit
    }
  }

  async getUser(id) {
    try {
      const response = await this.api.get(`/${id}`);
      console.log(response);
      return response.data;
    } catch (error) {
      const errorMessage = error.response
        ? error.response.data.message || "Ошибка при получении"
        : "Произошла ошибка сервера";

      throw new Error(errorMessage); // Пробрасываем ошибку для обработки в handleSubmit
    }
  }
}

export default UserServerApi;
