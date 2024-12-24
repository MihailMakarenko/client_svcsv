// import "./OrderCardBus.css";
// // import React, { useState } from "react";
// import CircleOutlinedIcon from "@mui/icons-material/CircleOutlined";
// import CircleTwoToneIcon from "@mui/icons-material/CircleTwoTone";
// import Button from "@mui/material/Button";
// import React, { useState, useEffect } from "react";
// import PlaceInBus from "../PlaceInBus/PlaceInBus";

// function OrderCardBus(props) {
//   // Проверяем, есть ли свободные места
//   const isAvailable = props.freePlace > 0;
//   const [showPlaceInBus, setShowPlaceInBus] = useState(false); // Состояние для управления видимостью

//   const handleButtonClickshowPlaceInBus = () => {
//     setShowPlaceInBus(true); // Устанавливаем состояние для отображения модального окна
//   };

//   const closeModal = () => {
//     setShowPlaceInBus(false); // Закрываем модальное окно
//   };

//   useEffect(() => {
//     if (showPlaceInBus) {
//       document.body.classList.add("no-scroll");
//     } else {
//       document.body.classList.remove("no-scroll");
//     }

//     // Очистка эффекта
//     return () => {
//       document.body.classList.remove("no-scroll");
//     };
//   }, [showPlaceInBus]);

//   return (
//     <div className="Order-card-bus">
//       <div className="dateDeparture-conatiner">
//         <span>{props.dateDeparture}</span>
//       </div>
//       <hr style={{ border: "1px solid gray" }} />
//       <div>
//         <p>
//           {props.startTime} <CircleOutlinedIcon />
//           {props.startCity}
//         </p>
//         <p>
//           {props.finishTime} <CircleTwoToneIcon />
//           {props.finishCity}
//         </p>
//         <hr style={{ border: "1px solid gray" }} />
//       </div>
//       <p className="carrier-class">Перевозчик: {props.carrier}</p>
//       <p>Свободных мест: {props.freePlace}</p>
//       <div className="price-container">
//         <span>
//           цена: <strong>{props.price} BYN</strong>
//         </span>
//       </div>
//       <div className="vl"></div>
//       <hr style={{ border: "1px solid gray" }} />
//       <Button
//         onClick={handleButtonClickshowPlaceInBus}
//         variant="contained"
//         disabled={!isAvailable}
//       >
//         {isAvailable ? "Заказать" : "Недоступно"}
//       </Button>

//       {/* Отображение модального окна, если оно открыто */}

//       {showPlaceInBus && (
//         <div className="modal-overlay">
//           <PlaceInBus
//             registerId={props.registerBookId}
//             countOfSeat={props.occupiedPlaces.length + props.freePlace}
//             closeModal={closeModal}
//             occupiedSeats={props.occupiedPlaces}
//           />
//         </div>
//       )}
//     </div>
//   );
// }

// export default OrderCardBus;

import "./OrderCardBus.css";
import CircleOutlinedIcon from "@mui/icons-material/CircleOutlined";
import CircleTwoToneIcon from "@mui/icons-material/CircleTwoTone";
import Button from "@mui/material/Button";
import React, { useState, useEffect } from "react";
import PlaceInBus from "../PlaceInBus/PlaceInBus";

function OrderCardBus(props) {
  const isAvailable = props.freePlace > 0;
  const [showPlaceInBus, setShowPlaceInBus] = useState(false);
  const [isUserAuthenticated, setIsUserAuthenticated] = useState(false);

  const handleButtonClickshowPlaceInBus = () => {
    setShowPlaceInBus(true);
  };

  const closeModal = () => {
    setShowPlaceInBus(false);
  };

  useEffect(() => {
    const checkUserAuthentication = () => {
      const user = localStorage.getItem("idUser");
      setIsUserAuthenticated(!!user);
    };

    // Проверка наличия пользователя при монтировании компонента
    checkUserAuthentication();

    // Добавление обработчика события для отслеживания изменений в localStorage
    window.addEventListener("storage", checkUserAuthentication);

    // // Очистка эффекта
    // return () => {
    //   window.removeEventListener("storage", checkUserAuthentication);
    // };
  }, [showPlaceInBus]);

  return (
    <div className="Order-card-bus">
      <div className="dateDeparture-conatiner">
        <span>{props.dateDeparture}</span>
      </div>
      <hr style={{ border: "1px solid gray" }} />
      <div>
        <p>
          {props.startTime} <CircleOutlinedIcon />
          {props.startCity}
        </p>
        <p>
          {props.finishTime} <CircleTwoToneIcon />
          {props.finishCity}
        </p>
        <hr style={{ border: "1px solid gray" }} />
      </div>
      <p className="carrier-class">Перевозчик: {props.carrier}</p>
      <p>Свободных мест: {props.freePlace}</p>
      <div className="price-container">
        <span>
          цена: <strong>{props.price} BYN</strong>
        </span>
      </div>
      <div className="vl"></div>
      <hr style={{ border: "1px solid gray" }} />
      <Button
        onClick={handleButtonClickshowPlaceInBus}
        variant="contained"
        disabled={!isAvailable || !isUserAuthenticated}
      >
        {isAvailable
          ? isUserAuthenticated
            ? "Заказать"
            : "Необходимо войти"
          : "Недоступно"}
      </Button>

      {showPlaceInBus && (
        <div className="modal-overlay">
          <PlaceInBus
            registerId={props.registerBookId}
            countOfSeat={props.occupiedPlaces.length + props.freePlace}
            closeModal={closeModal}
            occupiedSeats={props.occupiedPlaces}
          />
        </div>
      )}
    </div>
  );
}

export default OrderCardBus;
