import Footer from "../../Components/footer/footer";
import Header from "../../Components/header/header";
import "./UserPage.css";
import * as React from "react";
import Box from "@mui/material/Box";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import RestoreIcon from "@mui/icons-material/Restore";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import CssBaseline from "@mui/material/CssBaseline";
import Paper from "@mui/material/Paper";
import OrderCard from "../../Components/OrderCard/OrderCard";
import { useNavigate } from "react-router-dom";
import Pagination from "@mui/material/Pagination";
import TicketServerApi from "../../apiService/ticketService";
import UserServerApi from "../../apiService/userService";
import CallbackServerApi from "../../apiService/callbackService";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";

export default function UserPage() {
  const ticketServerApi = new TicketServerApi();
  const userServerApi = new UserServerApi();
  const callbackServerApi = new CallbackServerApi();
  const [value, setValue] = React.useState(0);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [trips, setTrips] = React.useState([]); // Состояние для хранения поездок
  const [loading, setLoading] = React.useState(true); // Состояние загрузки
  const itemsPerPage = 4; // Количество элементов на странице
  const [isGetNewsletter, setUserNewsletter] = React.useState(false); // Начальное значение
  const [isGetNotification, setUserNotification] = React.useState(false); // Начальное значение
  const [isCallbackRequested, setCallbackReguested] = React.useState(false);

  const navigate = useNavigate();

  React.useEffect(() => {
    const userId = localStorage.getItem("idUser");
    if (!userId) {
      console.error(
        "ID пользователя не найден в localStorage. Перенаправление на страницу входа."
      );
      navigate("/login"); // Перенаправление на страницу входа
      return;
    }

    const fetchTrips = async () => {
      setLoading(true); // Устанавливаем состояние загрузки
      const userId = localStorage.getItem("idUser");
      if (!userId) {
        console.error("ID пользователя не найден в localStorage.");
        setLoading(false);
        return;
      }
      try {
        const response = await ticketServerApi.getTicetByUserId(userId);
        setTrips(response.data); // Устанавливаем полученные данные в состояние
      } catch (error) {
        console.error("Ошибка при получении поездок:", error);
      } finally {
        setLoading(false); // Устанавливаем состояние загрузки в false
      }
    };

    const fetchUser = async () => {
      const userId = localStorage.getItem("idUser");
      if (!userId) {
        console.error("ID пользователя не найден в localStorage.");
        return;
      }
      try {
        const response = await userServerApi.getUser(userId);
        setUserNewsletter(response.isGetNewsletter);
        setUserNotification(response.isGetNotifications);
      } catch (error) {
        console.error("Ошибка при получении данных пользователя:", error);
      }
    };

    const fetchCallback = async () => {
      const userId = localStorage.getItem("idUser");
      if (!userId) {
        console.error("ID пользователя не найден в localStorage.");
        return;
      }
      try {
        const response = await callbackServerApi.getIsCallbackForUser(userId);
        setCallbackReguested(response);
        console.log(response);
      } catch (error) {
        console.error("Ошибка при получении данных пользователя:", error);
      }
    };

    fetchTrips(); // Вызываем функцию получения данных поездок
    fetchUser();
    fetchCallback(); // Вызываем функцию получения данных пользователя
  }, []);

  const handleNavigate = (newValue) => {
    if (newValue === 2) {
      navigate("/");
    } else {
      setValue(newValue);
      setCurrentPage(1); // Сбрасываем страницу при смене вкладки
    }
  };

  const UserChangeNotification = async () => {
    const userId = localStorage.getItem("idUser");
    if (!userId) {
      console.error("ID пользователя не найден в localStorage.");
      return;
    }
    try {
      const response = await userServerApi.changeNotification(
        userId,
        !isGetNotification
      );
      setUserNotification(!isGetNotification); // Обновляем состояние
      console.log(response);
    } catch (error) {
      console.error("Ошибка при изменении уведомлений:", error);
    }
  };

  const UserChangeNews = async () => {
    const userId = localStorage.getItem("idUser");
    if (!userId) {
      console.error("ID пользователя не найден в localStorage.");
      return;
    }
    try {
      const response = await userServerApi.changeNews(userId, !isGetNewsletter);
      setUserNewsletter(!isGetNewsletter); // Обновляем состояние
      console.log(response);
    } catch (error) {
      console.error("Ошибка при изменении новостей:", error);
    }
  };

  const Exit = () => {
    localStorage.removeItem("firstName");
    localStorage.removeItem("idUser");
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/");
  };

  const ongoingTrips = trips.filter(
    (trip) => trip.Status === "В пути" || trip.Status === "Заказан"
  );
  const completedTrips = trips.filter(
    (trip) => trip.Status === "Завершён" || trip.Status === "Отменён"
  );

  const currentTrips = value === 0 ? completedTrips : ongoingTrips;
  const totalPages = Math.ceil(currentTrips.length / itemsPerPage);

  const displayedTrips = currentTrips.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const RequestCallback = async () => {
    const userId = localStorage.getItem("idUser");
    const response = await callbackServerApi.requestCallback(userId);
    setCallbackReguested(true);
  };

  const handleTripUpdate = (updatedTrip) => {
    setTrips((prevTrips) =>
      prevTrips.map((trip) =>
        trip.TicketId === updatedTrip.TicketId ? updatedTrip : trip
      )
    );
  };

  return (
    <Box sx={{ pb: 7 }}>
      <CssBaseline />
      <Header />
      <main>
        <ButtonGroup
          className="button-group"
          variant="contained"
          aria-label="Basic button group"
        >
          <Button disabled={isCallbackRequested} onClick={RequestCallback}>
            {isCallbackRequested ? "Звонок запрошен" : "Запросить звонок"}
          </Button>
          <Button onClick={UserChangeNotification}>
            {isGetNotification
              ? "Отписаться от уведомлений"
              : "Подписаться на уведомления"}
          </Button>
          <Button onClick={UserChangeNews}>
            {isGetNewsletter
              ? "Отписаться от рассылки"
              : "Подписаться на рассылку"}
          </Button>
          <Button onClick={Exit}>Выйти</Button>
        </ButtonGroup>
        {loading ? ( // Проверяем состояние загрузки
          <h2>Загрузка...</h2>
        ) : (
          <>
            {value === 0 && <h2>История</h2>}
            {value === 1 && <h2>Активные</h2>}
            <div className="card-container-userPage">
              {displayedTrips.length === 0 ? ( // Проверяем, есть ли поездки
                <h3 className="header-orderCards">Заказов нет</h3> // Сообщение, если поездок нет
              ) : (
                displayedTrips.map((trip) => (
                  <OrderCard
                    key={trip.TicketId}
                    ticketId={trip.TicketId}
                    startCity={trip.StartCity}
                    finishCity={trip.FinishCity}
                    startTime={trip.StartTime}
                    finishTime={trip.FinishTime}
                    dateDeparture={trip.DateTime}
                    carrier={trip.NameCompany}
                    busNumber={trip.BusNumber}
                    places={trip.Seats}
                    status={trip.Status}
                    onUpdate={handleTripUpdate} // Передаем функцию обновления
                  />
                ))
              )}
            </div>

            {displayedTrips.length > 0 && ( // Пагинация только если есть поездки
              <div className="pagination-container">
                <Pagination
                  count={totalPages}
                  variant="outlined"
                  color="primary"
                  page={currentPage}
                  onChange={(event, value) => setCurrentPage(value)}
                />
              </div>
            )}
          </>
        )}
      </main>
      <Paper
        sx={{ position: "fixed", bottom: 0, left: 0, right: 0 }}
        elevation={3}
      >
        <BottomNavigation
          showLabels
          value={value}
          onChange={(event, newValue) => handleNavigate(newValue)}
        >
          <BottomNavigationAction label="История" icon={<RestoreIcon />} />
          <BottomNavigationAction label="Активные" icon={<AccessTimeIcon />} />
          <BottomNavigationAction label="Заказать" icon={<AddCircleIcon />} />
        </BottomNavigation>
      </Paper>
      <Footer />
    </Box>
  );
}
