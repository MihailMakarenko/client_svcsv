import React, { useState, useEffect } from "react";
import Counter from "../../Components/counterAddRemove/Counter";
import Header from "../../Components/header/header";
import "./AdminProfile.css";
import Footer from "../../Components/footer/footer";
import Input from "@mui/material/Input";
import Paper from "@mui/material/Paper";
import { DataGrid } from "@mui/x-data-grid";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import MailServerApi from "../../apiService/mailService";
import BusesServerApi from "../../apiService/busesService";
import RouteServerApi from "../../apiService/routeServise";
import Pagination from "@mui/material/Pagination";
import CallbackServerApi from "../../apiService/callbackService";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { blue } from "@mui/material/colors";

function AdminProfile() {
  const [busNumber, setBusNumber] = useState("");
  const [busModel, setBusModel] = useState("");
  const [carrier, setCarrier] = useState("");
  const [mailHeader, setMailHeader] = useState("");
  const [mailText, setMailText] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [startCity, setStartCity] = useState("");
  const [finishCity, setFinishCity] = useState("");
  const [distance, setDistance] = useState(20);
  const [errorMessage, setErrorMessage] = useState("");
  // const [loading, setLoading] = useState(false);
  const [seats, setSeats] = useState(9); // Начальное количество мест

  const [currentPageBus, setCurrentPageBus] = useState(1);
  const [currentPageRoute, setCurrentPageRoute] = useState(1);
  const [currentPageCallback, setCurrentPageCallback] = useState(1);

  const [totalPagesBus, setTotalPagesBus] = useState(0);
  const [totalPagesRoute, setTotalPagesRoutes] = useState(0);
  const [totalPagesCallback, setTotalPagesCallback] = useState(0);

  const [buses, setBuses] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [callbacks, setCallbaks] = useState([]);

  const [loading, setLoading] = useState(false);
  const [openCallbackModal, setOpenCallbackModal] = useState(false);

  const mailServerApi = new MailServerApi();
  const busesServerApi = new BusesServerApi();
  const routeServerApi = new RouteServerApi();
  const callbackServerApi = new CallbackServerApi();

  const fetchBuses = async () => {
    try {
      const response = await busesServerApi.getAllBusesWithPagination(
        currentPageBus
      );
      setBuses(response.buses);
      setTotalPagesBus(response.totalPages);
    } catch (error) {
      console.error("Ошибка при получении автобусов:", error);
    }
  };

  const fetchRoutes = async () => {
    try {
      const response = await routeServerApi.getAllRoutesWithPagination(
        currentPageRoute
      );
      console.log(response);
      setRoutes(response.routes);
      console.log(response.totalCount);
      setTotalPagesRoutes(response.totalPages);
    } catch (error) {
      console.error("Ошибка при получении автобусов:", error);
    }
  };

  const fetchCallbacks = async () => {
    try {
      const response = await callbackServerApi.getActiveCallbackWithPagination(
        currentPageCallback
      );
      console.log(response);
      setCallbaks(response.callbacks);
      setTotalPagesCallback(response.totalPages);
    } catch (error) {
      console.error("Ошибка при получении автобусов:", error);
    }
  };

  useEffect(() => {
    fetchRoutes();
    fetchBuses();
    fetchCallbacks();
  }, [currentPageBus, currentPageRoute, currentPageCallback]);

  const sendMail = async () => {
    if (!mailHeader || !mailText) {
      setErrorMessage("Пожалуйста, заполните все поля.");
      setOpenSnackbar(true);
      return;
    }

    setLoading(true);
    try {
      await mailServerApi.sendMail(mailText, mailHeader);
      setErrorMessage("Сообщения успешно отправлены.");
      setOpenSnackbar(true);
      setMailHeader("");
      setMailText("");
    } catch (error) {
      console.error("Ошибка при отправке:", error);
      setErrorMessage("Произошла ошибка при отправке сообщений.");
      setOpenSnackbar(true);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChangeBus = (event, value) => {
    setCurrentPageBus(value);
    fetchBuses();
  };

  const handlePageChangeCallbacks = (event, value) => {
    setCurrentPageCallback(value);
    fetchCallbacks();
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const handleBusNumberChange = (e) => {
    const { value } = e.target;
    const cleanedValue = value.replace(/[^0-9A-Za-z/]/g, "");
    let formattedValue = "";
    const parts = cleanedValue.split("/");

    if (parts[0]) {
      const firstPart = parts[0].replace(/[^0-9]/g, "").slice(0, 4);
      formattedValue = firstPart;
    }

    if (formattedValue.length === 4) {
      formattedValue += "/";
    }

    if (parts.length > 1) {
      const secondPart = parts[1].replace(/[^0-9A-Za-z]/g, "").slice(0, 2);
      if (secondPart.length >= 2) {
        const digit = secondPart[0];
        const letter = secondPart[1].toUpperCase();
        formattedValue += `${digit}${letter}`;
      } else if (secondPart.length === 1) {
        formattedValue += `${secondPart}`;
      }
    }

    setBusNumber(formattedValue.trim());
  };

  const handleSeatsChange = (value) => {
    if (value >= 9) {
      setSeats(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Проверка на валидность данных
    if (busNumber.length !== 7) {
      setErrorMessage("Номер автобуса должен состоять из 7 символов.");
      setOpenSnackbar(true);
      return;
    }
    if (busModel.length < 3) {
      setErrorMessage("Название автобуса должно содержать минимум 3 символа.");
      setOpenSnackbar(true);
      return;
    }
    if (carrier.length < 3) {
      setErrorMessage("Название компании должно содержать минимум 3 символа.");
      setOpenSnackbar(true);
      return;
    }

    try {
      const response = await busesServerApi.createBuse(
        busNumber,
        busModel,
        carrier,
        seats
      );
      // Логика для обработки успешного ответа
      setErrorMessage("Автобус успешно добавлен.");
      setOpenSnackbar(true);
      // Очистка полей
      setBusNumber("");
      setBusModel("");
      setCarrier("");
      setSeats(9);
    } catch (error) {
      console.error("Ошибка при добавлении автобуса:", error);
      setErrorMessage("Произошла ошибка при добавлении автобуса.");
      setOpenSnackbar(true);
    }
  };

  const handleSubmitRoute = async (e) => {
    e.preventDefault(); // Предотвращаем перезагрузку страницы

    // Проверка на валидность данных маршрута
    if (startCity.length < 3) {
      setErrorMessage("Начальный город должен содержать минимум 3 буквы.");
      setOpenSnackbar(true);
      return;
    }
    if (finishCity.length < 3) {
      setErrorMessage("Конечный город должен содержать минимум 3 буквы.");
      setOpenSnackbar(true);
      return;
    }
    if (distance <= 0) {
      setErrorMessage("Расстояние должно быть положительным числом.");
      setOpenSnackbar(true);
      return;
    }

    try {
      const response = await routeServerApi.createRoute(
        startCity,
        finishCity,
        distance
      );
      setErrorMessage("Маршрут успешно добавлен.");
      setOpenSnackbar(true);
      // Очистка полей
      setStartCity("");
      setFinishCity("");
      setDistance(0);
    } catch (error) {
      console.error("Ошибка при добавлении маршрута:", error);
      setErrorMessage("Произошла ошибка при добавлении маршрута.");
      setOpenSnackbar(true);
    }
  };

  const handlePageChangeRoute = async (event, value) => {
    setCurrentPageRoute(value);
    console.log(`Текущая страница: ${value}`);
    fetchRoutes();
    // Здесь вы можете добавить логику для загрузки данных для выбранной страницы
  };

  const handleEditBus = async (e) => {};

  const handleDeleteBus = async (e) => {};

  const handleEditRoute = async (e) => {};

  const handleDeleteRoute = async (e) => {};

  const handleCall = async (callbackId) => {
    const response = await callbackServerApi.updateStatusCallback(callbackId);
    setCallbaks(
      callbacks.filter((callback) => callback.CallbackId !== callbackId)
    );
    console.log(response);
  };

  const handleOpenCallbackModal = () => {
    setOpenCallbackModal(true);
  };

  const handleCloseCallbackModal = () => {
    setOpenCallbackModal(false);
  };

  const rows = [
    // Ваши строки для DataGrid
  ];

  return (
    <div>
      <Header />
      <main>
        <div className="div-flex-container">
          <div className="form-container">
            <h2>Добавить автобус</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="bus-number">Номер автобуса (7 символов)</label>
                <Input
                  type="text"
                  id="bus-number"
                  name="bus-number"
                  value={busNumber}
                  onChange={handleBusNumberChange}
                  required
                  placeholder="1234/3B"
                />
              </div>
              <div className="form-group">
                <label htmlFor="bus-model">Модель (мин. 3 символа)</label>
                <Input
                  type="text"
                  id="bus-model"
                  name="bus-model"
                  value={busModel}
                  onChange={(e) => setBusModel(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="carrier">Перевозчик (мин. 3 символа)</label>
                <Input
                  type="text"
                  id="carrier"
                  name="carrier"
                  value={carrier}
                  onChange={(e) => setCarrier(e.target.value)}
                  required
                />
              </div>
              <Counter
                countValue={seats}
                onCountChange={handleSeatsChange} // Передаем функцию обновления
                countName="Количество мест"
                Text="Количество мест"
              />
              <button className="add" type="submit">
                Добавить автобус
              </button>
            </form>
          </div>
          <div>
            <div className="TableContainer">
              <table className="TableClass">
                <thead>
                  <tr>
                    <th> Номер </th>
                    <th> Модель </th>
                    <th> Перевозчик </th>
                    <th> Число мест </th>
                    <th> Действия </th>
                  </tr>
                </thead>
                <tbody>
                  {buses.map((route, index) => (
                    <tr key={index}>
                      <td>{route.BusNumber}</td>
                      <td>{route.NameCompany}</td>
                      <td>{route.Model}</td>
                      <td>{route.Capacity}</td>
                      <td>
                        <button
                          className="buttonTableClass"
                          onClick={() => handleEditBus(index)}
                        >
                          Изменить
                        </button>
                        <button
                          className="buttonTableClass"
                          onClick={() => handleDeleteBus(index)}
                        >
                          Удалить
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="container-pagination">
              <Pagination
                count={totalPagesBus} // Общее количество страниц
                page={currentPageBus} // Текущая страница
                onChange={handlePageChangeBus} // Обработчик изменения страницы
                color="primary"
              />
            </div>
          </div>
        </div>

        <div className="div-flex-container">
          <div className="form-container">
            <h2>Добавить маршрут</h2>
            <form onSubmit={handleSubmitRoute}>
              <div className="form-group">
                <label htmlFor="start-city">Начальный город</label>
                <Input
                  type="text"
                  id="start-city"
                  name="start-city"
                  required
                  value={startCity}
                  onChange={(e) => setStartCity(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label htmlFor="end-city">Конечный город</label>
                <Input
                  type="text"
                  id="end-city"
                  name="end-city"
                  required
                  value={finishCity}
                  onChange={(e) => setFinishCity(e.target.value)}
                />
              </div>
              <Counter
                countValue={distance}
                onCountChange={setDistance} // Передаем функцию обновления
                countName="Расстояние (км)"
                Text="Расстояние (км)"
              />

              <button className="add" type="submit">
                Добавить маршрут
              </button>
            </form>
          </div>

          <div>
            <div className="TableContainer">
              <table className="TableClass">
                <thead>
                  <tr>
                    <th> Начальный город </th>
                    <th> Конченый город</th>
                    <th>Расстояние</th>
                    <th>Действия</th>
                  </tr>
                </thead>
                <tbody>
                  {console.log(routes)}
                  {routes.map((route, index) => (
                    <tr key={index}>
                      <td>{route.StartCity}</td>
                      <td>{route.FinishCity}</td>
                      <td>{route.Distance}</td>

                      <td>
                        <button
                          className="buttonTableClass"
                          onClick={() => handleEditRoute(index)}
                        >
                          Изменить
                        </button>
                        <button
                          className="buttonTableClass"
                          onClick={() => handleDeleteRoute(index)}
                        >
                          Удалить
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="container-pagination">
              <Pagination
                count={totalPagesRoute} // Общее количество страниц
                page={currentPageRoute} // Текущая страница
                onChange={handlePageChangeRoute} // Обработчик изменения страницы
                color="primary"
              />
            </div>
          </div>
        </div>

        <div className="form-container sendNewLetter">
          <h2>Рассылка для пользователей</h2>
          <div className="container-header-mail">
            <TextField
              id="mail-header"
              label="Заголовок"
              style={{ width: "300px" }}
              value={mailHeader}
              onChange={(e) => setMailHeader(e.target.value)}
              disabled={loading}
            />
          </div>
          <div className="container-header-mail">
            <TextField
              id="mail-text"
              label="Текст письма"
              multiline
              style={{ width: "300px" }}
              value={mailText}
              onChange={(e) => setMailText(e.target.value)}
              disabled={loading}
            />
          </div>
          <Button type="submit" onClick={sendMail} disabled={loading}>
            Отправить
          </Button>
          <div style={{ marginTop: 20 }}>
            <Button type="button" onClick={handleOpenCallbackModal}>
              Обратный звонок
            </Button>
          </div>
        </div>
        <Snackbar
          open={openSnackbar}
          autoHideDuration={3000}
          onClose={handleCloseSnackbar}
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity={errorMessage.includes("успешно") ? "success" : "error"}
            sx={{ width: "100%" }}
          >
            {errorMessage}
          </Alert>
        </Snackbar>

        <Dialog open={openCallbackModal} onClose={handleCloseCallbackModal}>
          <DialogTitle>Обратный звонок</DialogTitle>
          <DialogContent>
            <div
              style={{
                alignItems: "center",
              }}
            >
              <div>
                <table className="call-table">
                  <thead>
                    <tr className="call-table-header">
                      <th className="call-table-header-cell">Имя</th>
                      <th className="call-table-header-cell">Фамилия</th>
                      <th className="call-table-header-cell">Номер телефона</th>
                      <th className="call-table-header-cell">Действия</th>
                    </tr>
                  </thead>
                  <tbody>
                    {callbacks.map((callback) => (
                      <tr key={callback.CallbackId} className="call-table-row">
                        <td className="call-table-cell">
                          {callback.user.FirstName}
                        </td>
                        <td className="call-table-cell">
                          {callback.user.LastName}
                        </td>
                        <td className="call-table-cell">
                          <a
                            href={`tel:${callback.user.PhoneNumber}`}
                            // className="phone-number"
                            style={{ color: blue }}
                          >
                            {callback.user.PhoneNumber}
                          </a>
                        </td>
                        <td className="call-table-cell">
                          <Button
                            variant="contained"
                            color="primary"
                            onClick={() => handleCall(callback.CallbackId)}
                            className="call-table-button"
                          >
                            Совершен
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="container-pagination">
                <Pagination
                  count={totalPagesCallback} // Общее количество страниц
                  page={currentPageCallback} // Текущая страница
                  onChange={handlePageChangeCallbacks} // Обработчик изменения страницы
                  color="primary"
                />
              </div>
              {/* <p>Обратный звонок</p> */}
            </div>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseCallbackModal} color="primary">
              Закрыть
            </Button>
          </DialogActions>
        </Dialog>
      </main>
      <Footer />
    </div>
  );
}

export default AdminProfile;
