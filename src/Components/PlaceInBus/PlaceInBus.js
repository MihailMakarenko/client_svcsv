import React, { useState } from "react";
import "./PlaceInBus.css";
import Button from "@mui/material/Button";
import AirlineSeatReclineNormalIcon from "@mui/icons-material/AirlineSeatReclineNormal";
import CloseIcon from "@mui/icons-material/Close";
import TextField from "@mui/material/TextField";
import PromoCodeServerApi from "../../apiService/promocodeService";
import TicketServerApi from "../../apiService/ticketService";
import { useNavigate } from "react-router-dom";

function PlaceInBus({ registerId, countOfSeat, occupiedSeats, closeModal }) {
  const [promoCode, setPromoCode] = useState("");
  const [selectedSeats, setSelectedSeats] = useState([]);
  const promocodeServerApi = new PromoCodeServerApi();
  const ticketServerApi = new TicketServerApi();
  const navigate = useNavigate();

  const handleChange = (event) => {
    setPromoCode(event.target.value);
  };

  const handleOrder = async () => {
    // Проверяем, выбраны ли места
    if (selectedSeats && selectedSeats.length > 0) {
      try {
        console.log("Промокод:", promoCode);

        let discount = null;

        // Если промокод указан, проверяем его
        if (promoCode) {
          discount = await promocodeServerApi.getDiscountByCode(promoCode);
          console.log("Скидка:", discount);
        }

        const userId = localStorage.getItem("idUser");
        console.log("ID пользователя:", userId);

        // Если промокод не действителен, выводим сообщение
        if (promoCode && discount === undefined) {
          console.log("Промокод не действителен или не найден.");
          alert("Промокод не действителен или не найден.");
          return; // Завершаем выполнение функции
        }

        console.log(promoCode);
        console.log(discount);

        // Добавляем билет, отправляя null, если промокод не указан или не действителен
        const response = await ticketServerApi.addTicket(
          "Заказан",
          discount ? promoCode : null, // Используем промокод, если он действителен
          userId,
          registerId,
          selectedSeats
        );

        console.log(`Скидка: ${discount ? discount + "%" : "Нет скидки"}`);
        alert(`Билет заказан!`);
        closeModal();
        navigate("/UserPage"); // Переход на страницу регистрации
        // Здесь можно добавить логику для обработки заказа
      } catch (error) {
        console.error("Ошибка при получении скидки:", error);
        alert("Произошла ошибка при обработке промокода.");
      }
    } else {
      alert("Пожалуйста, выберите хотя бы одно место.");
    }
  };

  return (
    <div className="place-container">
      <div className="close-button" onClick={closeModal}>
        <CloseIcon />
      </div>
      <h2>Выберите места</h2>
      <div className="places">
        <RenderBusSeat
          numbersOfSeat={countOfSeat}
          occupiedSeats={occupiedSeats}
          selectedSeats={selectedSeats}
          setSelectedSeats={setSelectedSeats}
        />
      </div>
      <TextField
        id="filled-basic"
        label="Промокод"
        variant="filled"
        value={promoCode}
        onChange={handleChange}
        size="small"
        sx={{
          backgroundColor: "#f0f0f0", // Установите нужный цвет фона
          "& .MuiFilledInput-root": {
            backgroundColor: "#f0f0f0", // Установите цвет фона для заполненного состояния
          },
          // borderRadius: 12,
        }}
      />
      <Button
        variant="contained"
        className="button-order"
        onClick={handleOrder}
        style={{ marginTop: "20px" }}
      >
        Заказать
      </Button>
    </div>
  );
}

function RenderBusSeat({
  numbersOfSeat,
  occupiedSeats,
  selectedSeats,
  setSelectedSeats,
}) {
  const toggleSeat = (seatNumber) => {
    if (!occupiedSeats.includes(seatNumber)) {
      setSelectedSeats((prevSelected) => {
        if (prevSelected.includes(seatNumber)) {
          return prevSelected.filter((seat) => seat !== seatNumber);
        } else {
          return [...prevSelected, seatNumber];
        }
      });
    }
  };

  const renderSeat = (seatNumber) => {
    const isOccupied = occupiedSeats.includes(seatNumber);
    const isSelected = selectedSeats.includes(seatNumber);
    const seatClass = isOccupied
      ? "place occupied" // Занятое место
      : isSelected
      ? "place selected" // Выбранное место
      : "place"; // Обычное место

    return (
      <div
        key={seatNumber}
        className={seatClass}
        onClick={() => toggleSeat(seatNumber)}
      >
        <p>{seatNumber}</p>
        <AirlineSeatReclineNormalIcon />
      </div>
    );
  };

  const rows = [];
  for (let i = 1; i <= numbersOfSeat; i += 4) {
    rows.push(
      <div className="row-container" key={i}>
        <div className="two-place-container">
          {i <= numbersOfSeat && renderSeat(i)}
          {i + 1 <= numbersOfSeat && renderSeat(i + 1)}
        </div>
        <div className="two-place-container">
          {i + 2 <= numbersOfSeat && renderSeat(i + 2)}
          {i + 3 <= numbersOfSeat && renderSeat(i + 3)}
        </div>
      </div>
    );
  }

  return <>{rows}</>;
}

export default PlaceInBus;
