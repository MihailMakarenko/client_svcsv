import axios from "axios";
import BaseUrl from "./configuration";

class MailServerApi {
  constructor() {
    this.baseUrl = `${BaseUrl}/mail`;

    const token = localStorage.getItem("acsessToken");

    this.api = axios.create({
      baseURL: this.baseUrl,
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `${token}` : "", // Добавьте токен, если он есть
      },
    });
  }

  async sendMail(MainText, Header) {
    try {
      const response = await this.api.post("/", {
        header: Header,
        mainText: MainText,
      });

      return response.data; // Возвращаем данные, чтобы их можно было использовать в handleSubmit
    } catch (error) {
      throw error; // Пробрасываем ошибку, чтобы её можно было обработать в handleSubmit
    }
  }
}

export default MailServerApi;
