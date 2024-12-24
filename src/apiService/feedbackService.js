import axios from "axios";
import BaseUrl from "./configuration";

class BusesServerApi {
  constructor() {
    this.baseUrl = `${BaseUrl}/feedback`;

    const token = localStorage.getItem("acsessToken");

    this.api = axios.create({
      baseURL: this.baseUrl,
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `${token}` : "", // Добавьте токен, если он есть
      },
    });
  }

  async getRating(ticketId) {
    try {
      const response = await this.api.get(`${ticketId}`);
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

  async setRating(rating, ticketId) {
    console.log(rating);
    try {
      const response = await this.api.put(`${ticketId}`, {
        FeedbackId: 2,
        Rating: rating,
        TicketId: ticketId,
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
}

export default BusesServerApi;
