import axios from "axios";
import BaseUrl from "./configuration";

class ticketServerApi {
  constructor() {
    this.baseUrl = `${BaseUrl}/tickets`;

    const token = localStorage.getItem("acsessToken");

    this.api = axios.create({
      baseURL: this.baseUrl,
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `${token}` : "", // Добавьте токен, если он есть
      },
    });
  }

  async getDocxTicket(ticketId) {
    try {
      console.log(ticketId);
      console.log("Запрос на получение PDF...");
      const response = await this.api.get(`/downloadPdfTicket/${ticketId}`, {
        responseType: "blob",
      });
      console.log(response);

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

  async addTicket(
    status,
    promocode,
    userId,
    registerId,
    seats,
    successCallback,
    errorCallback
  ) {
    try {
      console.log(status, promocode, userId, registerId, seats);
      const response = await this.api.post("/", {
        Status: status,
        Promocode: promocode,
        UserId: userId,
        RegisterId: registerId,
        Seats: seats,
      });
      console.log("Мы тут");
      if (successCallback) {
        successCallback("Билет заказан!!!!");
      }
      return response.data; // Возвращаем данные, чтобы их можно было использовать в handleSubmit
    } catch (error) {
      if (error.response) {
        if (errorCallback) {
          errorCallback("Ошибка заказа");
        }
      } else {
        if (errorCallback) {
          errorCallback("Произошла ошибка");
        }
      }
      throw error; // Пробрасываем ошибку, чтобы её можно было обработать в handleSubmit
    }
  }

  async changeStatus(ticketId, status) {
    try {
      console.log("Запрос на изменение...");
      console.log(ticketId);
      const ticket = await this.api.get(`/${ticketId}`);
      console.log("AAAAAAA");
      console.log(ticket.data);
      console.log(status);
      console.log(ticketId);
      const response = await this.api.put(`/${ticketId}`, {
        ticketId: ticketId,
        Status: status,
        Promocode: ticket.data.Promocode,
        UserId: ticket.data.UserId,
        RegisterId: ticket.data.RegisterId,
        Seats: ticket.data.Seats,
      });
      console.log(response);

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
}

export default ticketServerApi;
