import "./OrderCard.css";
import * as React from "react";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import Rating from "@mui/material/Rating";
import Typography from "@mui/material/Typography";
import TicketServerApi from "../../apiService/ticketService";
import RatingServerApi from "../../apiService/feedbackService";

function OrderCard(props) {
  const [value, setValue] = React.useState(0);
  const [ratingSubmitted, setRatingSubmitted] = React.useState(false); // Состояние для отслеживания выставленного рейтинга
  const ticketServerApi = new TicketServerApi();
  const ratingServerApi = new RatingServerApi();

  const {
    key,
    ticketId,
    startCity,
    finishCity,
    startTime,
    finishTime,
    dateDeparture,
    carrier,
    busNumber,
    places = [], // Установка значения по умолчанию
    status,
  } = props;

  // Эффект для управления значением рейтинга в зависимости от статуса
  React.useEffect(() => {
    const fetchRating = async () => {
      try {
        const response = await ratingServerApi.getRating(ticketId);
        console.log(response[0].Rating);
        setValue(response[0].Rating); // Установите полученное значение рейтинга
        setRatingSubmitted(true); // Устанавливаем, что рейтинг выставлен
      } catch (error) {
        console.error("Ошибка при получении рейтинга:", error);
      }
    };

    if (status === "Завершён") {
      fetchRating();
    } else {
      setValue(0); // Сбрасываем значение для незавершённых поездок
      setRatingSubmitted(false); // Сбрасываем состояние выставленного рейтинга
    }
  }, [status, ticketId]); // Запускаем эффект при изменении статуса или ticketId

  const downloadTicket = async () => {
    try {
      console.log("Запрос на получение данных о билете...");
      console.log(startCity);
      // Запрос на получение PDF-документа
      const response = await ticketServerApi.getDocxTicket(ticketId);

      // Проверяем статус ответа
      if (!response || response.status !== 200) {
        throw new Error(
          `Ошибка при получении PDF: ${
            response ? response.status : "нет ответа"
          }`
        );
      }

      // Создаем Blob из полученных данных
      const blob = new Blob([response.data], { type: "application/pdf" });
      console.log(blob);

      // Создаем URL для Blob
      const url = window.URL.createObjectURL(blob);

      // Создаем временный элемент <a> для скачивания
      const a = document.createElement("a");
      a.href = url;
      a.download = `ticket.pdf`; // Устанавливаем имя файла
      document.body.appendChild(a);
      a.click(); // Имитируем клик
      document.body.removeChild(a); // Убираем элемент после загрузки
      window.URL.revokeObjectURL(url); // Освобождаем память
    } catch (error) {
      console.error("Ошибка при скачивании PDF:", error.message);
    }
  };

  const cancel = async () => {
    try {
      const response = await ticketServerApi.changeStatus(ticketId, "Отменён");
      console.log(response);
      if (response) {
        // Создаем обновленный объект поездки
        const updatedTrip = {
          TicketId: ticketId,
          StartCity: startCity,
          FinishCity: finishCity,
          StartTime: startTime,
          FinishTime: finishTime,
          DateTime: dateDeparture,
          NameCompany: carrier,
          BusNumber: busNumber,
          Seats: places,
          Status: "Отменён", // Обновляем статус
        };
        props.onUpdate(updatedTrip); // Обновляем родительское состояние
      }
    } catch (error) {
      console.error("Ошибка при отмене поездки:", error.message);
    }
  };

  const handleRatingChange = async (event, newValue) => {
    setValue(newValue);
    setRatingSubmitted(true);

    const response = await ratingServerApi.setRating(newValue, ticketId);
    // Отправка данных на сервер
    // try {
    //   const response = await fetch('/api/rate', { // Укажите ваш URL API
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify({ rating: newValue }), // Отправляем новое значение рейтинга
    //   });

    //   if (!response.ok) {
    //     throw new Error('Ошибка при отправке рейтинга');
    //   }

    //   const data = await response.json();
    //   console.log('Успешно отправлено:', data);
    // } catch (error) {
    //   console.error('Ошибка:', error);
    // }
  };

  return (
    <div className="card-container">
      <div className="route-card-container">
        <span>{startCity}</span>
        <ArrowForwardIcon />
        <span>{finishCity}</span>
      </div>
      <div className="time-container route-card-container">
        <span>
          <strong>{startTime.substring(0, 5)}</strong>
        </span>
        <div style={{ display: "inline", width: "77%" }}>
          <span>{dateDeparture}</span>
          <hr style={{ border: "1px solid gray" }} />
        </div>
        <span>
          <strong>{finishTime.substring(0, 5)}</strong>
        </span>
      </div>
      <div className="information-carrier-container">
        <span>Перевозчик: </span>
        <span>{carrier}</span>
        <p>Номер: {busNumber}</p>
        <hr style={{ border: "1px solid gray" }} />
        <span>Места: {places.join(", ")}</span>
        <hr style={{ border: "1px solid gray" }} />
      </div>
      <div className="route-card-container">
        <div className="button-container">
          <button
            disabled={
              status === "Завершён" ||
              status === "В пути" ||
              status === "Отменён"
            }
            onClick={cancel}
          >
            Отменить
          </button>
          <button onClick={downloadTicket}>Скачать</button>
        </div>
        <div className="route-card-container">
          <span className="ticket-status">{status}</span>
        </div>
      </div>
      <hr style={{ border: "1px solid gray" }} />
      <div className="route-card-container">
        {status === "Завершён" ? (
          <>
            <Typography component="legend">
              {ratingSubmitted ? "Поездка оценена!" : "Оцените поездку!"}
            </Typography>
            <Rating
              name="simple-controlled"
              value={value !== undefined ? value : 0} // Убедитесь, что значение никогда не undefined
              size="large"
              onChange={handleRatingChange}
            />
          </>
        ) : (
          <Typography component="legend">Оценка недоступна</Typography>
        )}
      </div>
    </div>
  );
}

export default OrderCard;
