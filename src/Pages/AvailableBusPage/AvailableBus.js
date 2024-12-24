import React, { useEffect, useState } from "react";
import Footer from "../../Components/footer/footer";
import Header from "../../Components/header/header";
import "./AvailableBus.css";
import CardBus from "../../Components/cardBus/cardBus";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Input from "@mui/material/Input";
import Label from "@mui/material/FormLabel";
import { useDispatch, useSelector } from "react-redux";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { addRoute, deleteRoute, updateRoute } from "../../store/slice/busSlice";
import RouteServerApi from "../../apiService/routeServise";
import BusesServerApi from "../../apiService/busesService";
import TripRegisterScheduleServerApi from "../../apiService/tripRegisterScheduleService";
import Pagination from "@mui/material/Pagination";
import ScheduleServerApi from "../../apiService/scheduleService";
import Stack from "@mui/material/Stack";
import { useNavigate } from "react-router-dom";

// Компонент для отображения модального окна с информацией о автобусе
const ModalWindow = ({ onClose, record }) => (
  <div className="modal">
    <div className="modal-content-bus-info">
      <span className="close-button" onClick={onClose}>
        &times;
      </span>
      <CardBus {...record} />
    </div>
  </div>
);

function AvailableBus() {
  const tripRegisterScheduleServerApi = new TripRegisterScheduleServerApi();
  const scheduleServerApi = new ScheduleServerApi();

  const dispatch = useDispatch();

  const [editIndex, setEditIndex] = useState(null);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [showModal, setShowModal] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [busesNumber, setBusesNumber] = useState([]);
  const [busRoutes, setBusRoutes] = useState([]);
  const [routes, setRoutes] = useState([]);
  const navigate = useNavigate();
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [currentPage, setCurrentPage] = useState(1);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
    console.log(`Текущая страница: ${value}`);
    fetchData();
    // Здесь вы можете добавить логику для загрузки данных для выбранной страницы
  };

  const [formData, setFormData] = useState({
    startCity: "",
    finishCity: "",
    startTime: "",
    finishTime: "",
    price: "",
    DefaultBusNumber: "",
    monday: false,
    tuesday: false,
    wednesday: false,
    thursday: false,
    friday: false,
    saturday: false,
    sunday: false,
  });

  const routeServerApi = new RouteServerApi();
  const busesServerApi = new BusesServerApi();

  const fetchData = async () => {
    try {
      const response =
        await tripRegisterScheduleServerApi.getFullInformationAboutBus(
          currentPage
        );
      console.log(response);
      setBusRoutes(response.filteredRoutes);
      console.log(response.totalCount);
      setTotalPages(response.totalCount);
    } catch (error) {
      console.error("Ошибка при получении автобусов:", error);
    }
  };

  // Получение маршрутов и автобусов
  useEffect(() => {
    const fetchRoutes = async () => {
      try {
        const response = await routeServerApi.getRoutes();
        const formattedRoutes = response.data.map(
          (route) => `${route.StartCity}–${route.FinishCity}`
        );
        setRoutes(formattedRoutes);
      } catch (error) {
        console.error("Ошибка при получении маршрутов:", error);
      }
    };

    const fetchBuses = async () => {
      try {
        const response = await busesServerApi.getAllBuses();
        const busNumbers = response.map((bus) => bus.BusNumber);
        setBusesNumber(busNumbers);
      } catch (error) {
        console.error("Ошибка при получении автобусов:", error);
      }
    };

    fetchRoutes();
    fetchBuses();
    fetchData();
  }, [currentPage]);

  // Функция сортировки
  const handleSort = (key) => {
    const direction =
      sortConfig.key === key && sortConfig.direction === "asc" ? "desc" : "asc";
    setSortConfig({ key, direction });
  };

  // Обработка отображения модального окна
  const handleDisplayAlert = (route) => {
    setSelectedRecord(route);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedRecord(null);
  };

  // Уведомления о добавлении и обновлении маршрута
  const handleCreateRouteSuccess = (message) => {
    setNotification({ open: true, message, severity: "success" });
  };

  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Проверка на незаполненные поля
    const {
      startCity,
      finishCity,
      startTime,
      finishTime,
      price,
      DefaultBusNumber,
    } = formData;

    if (
      !startCity ||
      !finishCity ||
      !startTime ||
      !finishTime ||
      !price
      // !DefaultBusNumber
    ) {
      setNotification({
        open: true,
        message: "Пожалуйста, заполните все поля!",
        severity: "error",
      });
      return;
    }

    // Проверка на корректность времени
    if (startTime >= finishTime) {
      setNotification({
        open: true,
        message: "Время отправления должно быть раньше времени прибытия!",
        severity: "error",
      });
      return;
    }

    // Если поле редактируется
    if (editIndex !== null) {
      dispatch(updateRoute({ id: busRoutes[editIndex].id, ...formData }));

      setBusRoutes((busRoutes) => {
        const newRoutes = [...busRoutes]; // создаём копию массива
        newRoutes[editIndex] = formData; // заменяем элемент
        return newRoutes; // возвращаем новый массив
      });

      handleCreateRouteSuccess("Запись успешно обновлена!");
      setEditIndex(null);
    } else {
      // Если создается новая запись
      dispatch(addRoute({ id: busRoutes.length + 1, ...formData }));
      handleCreateRouteSuccess("Запись успешно добавлена!");
      setBusRoutes((busRoutes) => [...busRoutes, formData]);
      tripRegisterScheduleServerApi.addFormData(formData);
    }

    // Сброс формы после успешного сохранения
    setFormData({
      startCity: "",
      finishCity: "",
      startTime: "",
      finishTime: "",
      price: "",
      DefaultBusNumber: "",
      monday: false,
      tuesday: false,
      wednesday: false,
      thursday: false,
      friday: false,
      saturday: false,
      sunday: false,
    });
  };

  const handleEdit = (index) => {
    const routeToEdit = busRoutes[index];
    setEditIndex(index);
    setFormData(routeToEdit);
  };

  const exit = () => {
    localStorage.removeItem("firstName");
    localStorage.removeItem("idUser");
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/");
  };

  const handleDelete = async (index) => {
    const routeToDelete = busRoutes[index];
    // console.log(busRoutes[index].scheduleId);
    const response = await scheduleServerApi.setFalseShedule(
      busRoutes[index].scheduleId
    );
    busRoutes.splice(index, 1);
    console.log(busRoutes);
    console.log();
    setBusRoutes(busRoutes);
    dispatch(deleteRoute({ id: routeToDelete.id }));
    setNotification({
      open: true,
      message: "Запись успешно удалена!",
      severity: "error",
    });
  };

  // Фильтрация маршрутов по поисковому запросу
  const filteredRoutes = busRoutes.filter(
    (route) =>
      route.startCity.toLowerCase().includes(searchTerm.toLowerCase()) ||
      route.finishCity.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Сортировка маршрутов
  const sortedRoutes = [...filteredRoutes].sort((a, b) => {
    if (!sortConfig.key) return 0;
    const aValue = a[sortConfig.key].toLowerCase();
    const bValue = b[sortConfig.key].toLowerCase();
    return aValue < bValue
      ? sortConfig.direction === "asc"
        ? -1
        : 1
      : sortConfig.direction === "asc"
      ? 1
      : -1;
  });

  return (
    <div className="App">
      <Header />

      <div className="DivDisplayFlex AvailableBus-class">
        <div>
          <h2>Таблица маршрутов</h2>
          <input
            className="Search-input"
            type="text"
            placeholder="Поиск по таблице..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <div className="TableContainer">
            <table className="TableClass">
              <thead>
                <tr>
                  <th
                    onClick={() => handleSort("startCity")}
                    style={{ cursor: "pointer" }}
                  >
                    Город отправления
                  </th>
                  <th
                    onClick={() => handleSort("finishCity")}
                    style={{ cursor: "pointer" }}
                  >
                    Город прибытия
                  </th>
                  <th
                    onClick={() => handleSort("startTime")}
                    style={{ cursor: "pointer" }}
                  >
                    Время отправления
                  </th>
                  <th
                    onClick={() => handleSort("finishTime")}
                    style={{ cursor: "pointer" }}
                  >
                    Время прибытия
                  </th>
                  <th>Действия</th>
                </tr>
              </thead>
              <tbody>
                {sortedRoutes.map((route, index) => (
                  <tr key={index}>
                    <td>{route.startCity}</td>
                    <td>{route.finishCity}</td>
                    <td>{route.startTime}</td>
                    <td>{route.finishTime}</td>
                    <td>
                      <button
                        className="buttonTableClass"
                        onClick={() => handleEdit(index)}
                      >
                        Изменить
                      </button>
                      <button
                        className="buttonTableClass"
                        onClick={() => handleDelete(index)}
                      >
                        Удалить
                      </button>
                      <button
                        className="buttonTableClass"
                        onClick={() => handleDisplayAlert(route)}
                      >
                        Информация
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="container-pagination">
            <Pagination
              count={totalPages} // Общее количество страниц
              page={currentPage} // Текущая страница
              onChange={handlePageChange} // Обработчик изменения страницы
              color="primary"
            />
          </div>
        </div>
        <div>
          <form className="FormAddRoute" onSubmit={handleSubmit}>
            <h2>
              {editIndex !== null
                ? "Редактировать поездку"
                : "Добавить поездку"}
            </h2>

            <Autocomplete
              options={routes}
              getOptionLabel={(option) => option || ""}
              value={
                formData.startCity && formData.finishCity
                  ? `${formData.startCity}–${formData.finishCity}`
                  : ""
              }
              onChange={(event, newValue) => {
                if (newValue) {
                  const [startCity, finishCity] = newValue.split("–");
                  setFormData((prev) => ({
                    ...prev,
                    startCity,
                    finishCity,
                  }));
                } else {
                  setFormData((prev) => ({
                    ...prev,
                    startCity: "",
                    finishCity: "",
                  }));
                }
              }}
              renderInput={(params) => (
                <TextField {...params} label="Маршрут" />
              )}
            />

            <div className="DivDisplayFlex">
              <Label>Время отправления:</Label>
              <Input
                type="time"
                name="startTime"
                value={formData.startTime}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="DivDisplayFlex">
              <Label>Время прибытия:</Label>
              <Input
                type="time"
                name="finishTime"
                value={formData.finishTime}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="DivDisplayFlex">
              <Label>
                Цена:
                <Input
                  sx={{ maxWidth: 70 }}
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  required
                />
                {" p."}
              </Label>
            </div>

            <Autocomplete
              sx={{ marginTop: 3 }}
              options={busesNumber}
              value={formData.DefaultBusNumber}
              onChange={(event, newValue) =>
                setFormData((prev) => ({ ...prev, DefaultBusNumber: newValue }))
              }
              renderInput={(params) => (
                <TextField {...params} label="Номер автобуса" />
              )}
            />

            <div className="table-container-weekdays">
              <table className="WeekdaysTable">
                <thead>
                  <tr>
                    <th>Пн</th>
                    <th>Вт</th>
                    <th>Ср</th>
                    <th>Чт</th>
                    <th>Пт</th>
                    <th>Сб</th>
                    <th>Вс</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    {[
                      "monday",
                      "tuesday",
                      "wednesday",
                      "thursday",
                      "friday",
                      "saturday",
                      "sunday",
                    ].map((day) => (
                      <td key={day}>
                        <input
                          type="checkbox"
                          name={day}
                          checked={formData[day]}
                          onChange={handleInputChange}
                        />
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>

            <Button sx={{ marginTop: 2 }} type="submit">
              {editIndex !== null ? "Сохранить изменения" : "Добавить поездку"}
            </Button>
          </form>

          <div style={{ marginTop: 20 }}>
            <Button
              onClick={() => {
                navigate("/admin-profile");
              }}
            >
              Управленние
            </Button>
            <Button onClick={exit}>Выйти</Button>
          </div>
        </div>
      </div>
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
      >
        <Alert
          onClose={handleCloseNotification}
          severity={notification.severity}
          sx={{ width: "100%" }}
        >
          {notification.message}
        </Alert>
      </Snackbar>

      {showModal && selectedRecord && (
        <ModalWindow onClose={closeModal} record={selectedRecord} />
      )}

      <Footer />
    </div>
  );
}

export default AvailableBus;
