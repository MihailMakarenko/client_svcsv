// import React, { useState } from "react";
// import Header from "../../Components/header/header.js";
// import Footer from "../../Components/footer/footer.js";
// import Autocomplete from "@mui/material/Autocomplete";
// import TextField from "@mui/material/TextField";
// import ScheduleServerApi from "../../apiService/scheduleService.js";
// import { FaBus } from "react-icons/fa";
// import BusesServerApi from "../../apiService/busesService.js";
// import "./MainPage.css";
// import OrderCardBus from "../../Components/OrderCardBus/OrderCardBus.js";
// import RouteServerApi from "../../apiService/routeServise.js";

// function MainPage() {
//   const scheduleServerApi = new ScheduleServerApi();
//   const [startCity, setStartCity] = useState("");

//   const [startСities, setStartСities] = useState([]);
//   const [finishСities, setfinishСities] = useState([]);
//   const [finishCity, setFinishCity] = useState("");
//   const [date, setDate] = useState("");
//   const [buses, setBuses] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [startState, setStart] = useState(true);
//   const [sortOption, setSortOption] = useState("");
//   const [sortedBuses, setSortedBuses] = useState(buses);
//   const busesServerApi = new BusesServerApi();
//   const routeServerApi = new RouteServerApi();

//   React.useEffect(() => {
//     // Функция для получения поездок с сервера
//     const fetchCity = async () => {
//       try {
//         setLoading(true); // Устанавливаем состояние загрузки
//         const response = await routeServerApi.getStartFinishCity();
//         console.log(response.data);
//         setStartСities(response.data.uniqueStartCities);
//         setfinishСities(response.data.uniqueFinishCities);
//         console.log(loading);
//       } catch (error) {
//         console.error("Ошибка при получении поездок:", error);
//       }
//     };
//     const sortBuses = () => {
//       let sortedArray = [...buses]; // Копируем массив, чтобы не изменять оригинал

//       switch (sortOption) {
//         case "По времени отправления (Возраст)":
//           sortedArray.sort((a, b) => new Date(a.StartTime) - new Date(b.StartTime));
//           break;
//         case "По времени отправления (Убыван)":
//           sortedArray.sort((a, b) => new Date(b.StartTime) - new Date(a.StartTime));
//           break;
//         case "По цене (Возраст)":
//           sortedArray.sort((a, b) => a.Price - b.Price);
//           break;
//         case "По цене (Убыван)":
//           sortedArray.sort((a, b) => b.Price - a.Price);
//           break;
//         case "По свободным местам (Возраст)":
//           sortedArray.sort((a, b) => a.AvailableSeats - b.AvailableSeats);
//           break;
//         case "По свободным местам (Убыван)":
//           sortedArray.sort((a, b) => b.AvailableSeats - a.AvailableSeats);
//           break;
//         case "Времени в дороге (Возраст)":
//           sortedArray.sort((a, b) => {
//             const durationA = new Date(a.FinishTime) - new Date(a.StartTime);
//             const durationB = new Date(b.FinishTime) - new Date(b.StartTime);
//             return durationA - durationB;
//           });
//           break;
//         case "Времени в дороге (Убыван)":
//           sortedArray.sort((a, b) => {
//             const durationA = new Date(a.FinishTime) - new Date(a.StartTime);
//             const durationB = new Date(b.FinishTime) - new Date(b.StartTime);
//             return durationB - durationA;
//           });
//           break;
//         default:
//           break;
//       }

//       setSortedBuses(sortedArray);

//     fetchCity(); // Вызываем функцию получения данных
//   }, [sortOption, buses]);

//   const fetchBuses = async () => {
//     setLoading(true);
//     setStart(false);
//     setError(null);
//     try {
//       const response = await busesServerApi.getAvailableBuses(
//         startCity,
//         finishCity,
//         date
//       );
//       setBuses(response.data);
//     } catch (error) {
//       console.error("Ошибка при получении доступных автобусов:", error);
//       setError("Не удалось загрузить автобусы. Попробуйте позже.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!startCity || !finishCity || !date) {
//       alert(
//         "Пожалуйста, выберите начальный и конечный пункты и укажите дату поездки"
//       );
//       return;
//     }
//     if (!cities.includes(startCity) || !cities.includes(finishCity)) {
//       alert("Пожалуйста, выберите города из предложенных.");
//       return;
//     }
//     await fetchBuses();
//   };

//   const cities = [
//     "Москва",
//     "Санкт-Петербург",
//     "Екатеринбург",
//     "Тюмень",
//     "Казань",
//     "Набережные Челны",
//   ];

//   const downloadSchedule = async () => {
//     if (!startCity || !finishCity) {
//       alert("Пожалуйста, выберите начальный и конечный пункты.");
//       return;
//     }

//     try {
//       console.log("Запрос на получение расписания...");
//       const response = await scheduleServerApi.getExelSchedule(
//         startCity,
//         finishCity
//       );
//       if (!response || response.status !== 200) {
//         throw new Error(
//           `Ошибка при получении Excel: ${
//             response ? response.status : "нет ответа"
//           }`
//         );
//       }

//       const blob = new Blob([response.data], { type: "application/xlsx" });
//       const url = window.URL.createObjectURL(blob);
//       const a = document.createElement("a");
//       a.href = url;
//       a.download = `ticket.xlsx`;
//       document.body.appendChild(a);
//       a.click();
//       document.body.removeChild(a);
//       window.URL.revokeObjectURL(url);
//     } catch (error) {
//       console.error("Ошибка при скачивании Excel:", error.message);
//       setError("Ошибка при скачивании расписания. Попробуйте позже.");
//     }
//   };

//   return (
//     <div className="MainPage">
//       <Header />
//       <main>
//         <h1>
//           УДОБНЫЙ ЗАКАЗ <br /> АВТОБУСНЫХ БИЛЕТОВ <FaBus />
//         </h1>
//         <form className="form-search-ticket" onSubmit={handleSubmit}>
//           <div className="text-field">
//             <label className="text-field__label" htmlFor="startCity">
//               Начальный пункт
//             </label>
//             <Autocomplete
//               disablePortal
//               options={startСities}
//               onChange={(event, newValue) => setStartCity(newValue)}
//               renderInput={(params) => (
//                 <TextField {...params} label="Выберите город" />
//               )}
//             />
//           </div>

//           <div className="text-field">
//             <label className="text-field__label" htmlFor="finishCity">
//               Конечный пункт
//             </label>
//             <Autocomplete
//               disablePortal
//               options={finishСities}
//               onChange={(event, newValue) => setFinishCity(newValue)}
//               renderInput={(params) => (
//                 <TextField {...params} label="Выберите город" />
//               )}
//             />
//           </div>

//           <input
//             className="date-departure"
//             type="date"
//             onChange={(event) => setDate(event.target.value)}
//           />
//           <input type="submit" value={"Найти"} />
//           <button
//             type="button"
//             onClick={downloadSchedule}
//             disabled={!startCity || !finishCity}
//           >
//             Скачать расписание
//           </button>
//         </form>

//         {error && <h2 className="error-message">{error}</h2>}
//         <div className="sort-div">
//           <Autocomplete
//             disablePortal
//             options={[
//               "По времени отправления(Возраст)",
//               "По времени отправления(Убыван)",
//               "По цене(Возраст)",
//               "По цене(Убыван)",
//               "По свободным местам(Возраст)",
//               "По свободным местам(Убыван)",
//               "Времени в дороге(Возраст)",
//               "Времени в дороге(Убыван)",
//             ]}
//             onChange={(event, newValue) => {
//               setSortOption(newValue); // Устанавливаем выбранный вариант сортировки
//               console.log(newValue); // Здесь можно добавить логику сортировки
//             }}
//             renderInput={(params) => (
//               <TextField {...params} label="Выберите вариант сортировки" />
//             )}
//           />
//         </div>
//         <div className="Container-bus">
//           {startState ? (
//             <h2></h2>
//           ) : (
//             <>
//               {loading ? (
//                 <h2>Загрузка....</h2>
//               ) : (
//                 <>
//                   {buses.length === 0 ? (
//                     <h2 className="no-trips-message">Поездки не найдены!!!</h2>
//                   ) : (
//                     buses.map((bus) => (
//                       <OrderCardBus
//                         occupiedPlaces={bus.OccupiedSeats}
//                         registerBookId={bus.RegisterBookId}
//                         key={bus.RegisterBookId}
//                         carrier={bus.NameCompany}
//                         dateDeparture={bus.DateTime}
//                         startTime={bus.StartTime}
//                         startCity={bus.StartCity}
//                         finishTime={bus.FinishTime}
//                         finishCity={bus.FinishCity}
//                         platformNumber={1}
//                         price={bus.Price}
//                         freePlace={bus.AvailableSeats}
//                       />
//                     ))
//                   )}
//                 </>
//               )}
//             </>
//           )}
//         </div>
//       </main>
//       <Footer />
//     </div>
//   );
// }

// export default MainPage;
import React, { useState, useEffect } from "react";
import Header from "../../Components/header/header.js";
import Footer from "../../Components/footer/footer.js";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import ScheduleServerApi from "../../apiService/scheduleService.js";
import { FaBus } from "react-icons/fa";
import BusesServerApi from "../../apiService/busesService.js";
import "./MainPage.css";
import OrderCardBus from "../../Components/OrderCardBus/OrderCardBus.js";
import RouteServerApi from "../../apiService/routeServise.js";

function MainPage() {
  const scheduleServerApi = new ScheduleServerApi();
  const busesServerApi = new BusesServerApi();
  const routeServerApi = new RouteServerApi();

  const [startCity, setStartCity] = useState("");
  const [finishCity, setFinishCity] = useState("");
  const [date, setDate] = useState("");
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [startState, setStart] = useState(true);
  const [sortOption, setSortOption] = useState("");
  const [startCities, setStartCities] = useState([]);
  const [finishCities, setFinishCities] = useState([]);

  useEffect(() => {
    const fetchCities = async () => {
      setLoading(true);
      try {
        const response = await routeServerApi.getStartFinishCity();
        setStartCities(response.data.uniqueStartCities);
        setFinishCities(response.data.uniqueFinishCities);
      } catch (error) {
        console.error("Ошибка при получении городов:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCities();
  }, []);

  const calculateDuration = (startTime, finishTime) => {
    const [startHour, startMinute] = startTime.split(":").map(Number);
    const [finishHour, finishMinute] = finishTime.split(":").map(Number);
    return finishHour * 60 + finishMinute - (startHour * 60 + startMinute);
  };

  useEffect(() => {
    if (buses.length > 0) {
      const sortedBuses = [...buses]; // Копируем массив для сортировки
      switch (sortOption) {
        case "По времени отправления(Возраст)":
          sortedBuses.sort((a, b) => {
            const [hourA, minuteA] = a.StartTime.split(":").map(Number);
            const [hourB, minuteB] = b.StartTime.split(":").map(Number);
            return hourA * 60 + minuteA - (hourB * 60 + minuteB);
          });
          break;

        case "По времени отправления(Убыван)":
          sortedBuses.sort((a, b) => {
            const [hourA, minuteA] = a.StartTime.split(":").map(Number);
            const [hourB, minuteB] = b.StartTime.split(":").map(Number);
            return hourB * 60 + minuteB - (hourA * 60 + minuteA);
          });
          break;

        case "По цене(Возраст)":
          sortedBuses.sort((a, b) => a.Price - b.Price);
          break;

        case "По цене(Убыван)":
          sortedBuses.sort((a, b) => b.Price - a.Price);
          break;

        case "По свободным местам(Возраст)":
          sortedBuses.sort((a, b) => a.AvailableSeats - b.AvailableSeats);
          break;

        case "По свободным местам(Убыван)":
          sortedBuses.sort((a, b) => b.AvailableSeats - a.AvailableSeats);
          break;

        case "Времени в дороге(Возраст)":
          sortedBuses.sort((a, b) => {
            const durationA = calculateDuration(a.StartTime, a.FinishTime);
            const durationB = calculateDuration(b.StartTime, b.FinishTime);
            return durationA - durationB;
          });
          break;

        case "Времени в дороге(Убыван)":
          sortedBuses.sort((a, b) => {
            const durationA = calculateDuration(a.StartTime, a.FinishTime);
            const durationB = calculateDuration(b.StartTime, b.FinishTime);
            return durationB - durationA;
          });
          break;

        default:
          break;
      }
      setBuses(sortedBuses); // Обновляем состояние с отсортированным массивом
    }
  }, [sortOption, buses]);

  const fetchBuses = async () => {
    setLoading(true);
    setStart(false);
    setError(null);
    try {
      const response = await busesServerApi.getAvailableBuses(
        startCity,
        finishCity,
        date
      );
      setBuses(response.data);
      console.log(buses);
    } catch (error) {
      console.error("Ошибка при получении доступных автобусов:", error);
      setError("Не удалось загрузить автобусы. Попробуйте позже.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!startCity || !finishCity || !date) {
      alert(
        "Пожалуйста, выберите начальный и конечный пункты и укажите дату поездки"
      );
      return;
    }
    await fetchBuses();
  };

  const downloadSchedule = async () => {
    if (!startCity || !finishCity) {
      alert("Пожалуйста, выберите начальный и конечный пункты.");
      return;
    }

    try {
      const response = await scheduleServerApi.getExelSchedule(
        startCity,
        finishCity
      );
      if (!response || response.status !== 200) {
        throw new Error("Ошибка при получении Excel");
      }

      const blob = new Blob([response.data], { type: "application/xlsx" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `ticket.xlsx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Ошибка при скачивании Excel:", error.message);
      setError("Ошибка при скачивании расписания. Попробуйте позже.");
    }
  };

  return (
    <div className="MainPage">
      <Header />
      <main>
        <h1>
          УДОБНЫЙ ЗАКАЗ <br /> АВТОБУСНЫХ БИЛЕТОВ <FaBus />
        </h1>
        <form className="form-search-ticket" onSubmit={handleSubmit}>
          <div className="text-field">
            <label className="text-field__label" htmlFor="startCity">
              Начальный пункт
            </label>
            <Autocomplete
              disablePortal
              options={startCities}
              onChange={(event, newValue) => setStartCity(newValue)}
              renderInput={(params) => (
                <TextField {...params} label="Выберите город" />
              )}
            />
          </div>

          <div className="text-field">
            <label className="text-field__label" htmlFor="finishCity">
              Конечный пункт
            </label>
            <Autocomplete
              disablePortal
              options={finishCities}
              onChange={(event, newValue) => setFinishCity(newValue)}
              renderInput={(params) => (
                <TextField {...params} label="Выберите город" />
              )}
            />
          </div>

          <input
            className="date-departure"
            type="date"
            onChange={(event) => setDate(event.target.value)}
            min={new Date().toISOString().split("T")[0]}
          />
          <input type="submit" value={"Найти"} />
          <button
            type="button"
            onClick={downloadSchedule}
            disabled={!startCity || !finishCity}
          >
            Скачать расписание
          </button>
        </form>

        {error && <h2 className="error-message">{error}</h2>}
        <div className="sort-div">
          <Autocomplete
            disablePortal
            options={[
              "По времени отправления(Возраст)",
              "По времени отправления(Убыван)",
              "По цене(Возраст)",
              "По цене(Убыван)",
              "По свободным местам(Возраст)",
              "По свободным местам(Убыван)",
              "Времени в дороге(Возраст)",
              "Времени в дороге(Убыван)",
            ]}
            onChange={(event, newValue) => setSortOption(newValue)}
            renderInput={(params) => (
              <TextField {...params} label="Выберите вариант сортировки" />
            )}
          />
        </div>
        <div className="Container-bus">
          {startState ? (
            <h2></h2>
          ) : (
            <>
              {loading ? (
                <h2>Загрузка....</h2>
              ) : (
                <>
                  {buses.length === 0 ? (
                    <h2 className="no-trips-message">Поездки не найдены!!!</h2>
                  ) : (
                    buses.map((bus) => (
                      <OrderCardBus
                        occupiedPlaces={bus.OccupiedSeats}
                        registerBookId={bus.RegisterBookId}
                        key={bus.RegisterBookId}
                        carrier={bus.NameCompany}
                        dateDeparture={bus.DateTime}
                        startTime={bus.StartTime}
                        startCity={bus.StartCity}
                        finishTime={bus.FinishTime}
                        finishCity={bus.FinishCity}
                        platformNumber={1}
                        price={bus.Price}
                        freePlace={bus.AvailableSeats}
                      />
                    ))
                  )}
                </>
              )}
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default MainPage;
