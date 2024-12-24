import React, { useState } from "react";
import InputMask from "react-input-mask";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import "./Registration.css";
import CheckBox from "@mui/material/Checkbox";
import UserServerApi from "../../apiService/userService";
import { useNavigate } from "react-router-dom";

const RegistrationForm = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    isGetNotification: false,
    isGetNewsletter: false,
  });

  const navigate = useNavigate();
  const userServerApi = new UserServerApi();

  const [errors, setErrors] = useState({});
  const [open, setOpen] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");
  const [isSuccessful, setIsSuccessful] = useState(false); // Состояние для успешной регистрации

  const phonePattern = /^\+375\s?(25|29|33|44)\s?\d{3}\s?\d{2}\s?\d{2}$/; // Шаблон для номера РБ

  const handleChange = (e) => {
    const { name, type, checked, value } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.firstName) newErrors.firstName = "Имя обязательно";
    if (!formData.lastName) newErrors.lastName = "Фамилия обязательна";
    if (!formData.email) newErrors.email = "Почта обязательна";
    if (!formData.phone) {
      newErrors.phone = "Номер телефона обязателен";
    } else if (!phonePattern.test(formData.phone)) {
      newErrors.phone =
        "Введите корректный номер телефона (например, +375 29 XXX XXXX)";
    }
    if (!formData.password) newErrors.password = "Пароль обязателен";
    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Пароли не совпадают";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      try {
        // Предполагаем, что addPerson возвращает промис, который разрешается при успешной регистрации
        await userServerApi.addPerson(formData);

        // Устанавливаем сообщение об успешной регистрации
        setDialogMessage("Регистрация успешна!");
        setIsSuccessful(true); // Устанавливаем состояние успешной регистрации
        setOpen(true);
      } catch (error) {
        // Обработка ошибок, например, если пользователь уже зарегистрирован
        setDialogMessage(
          `Пользователь с такой почтой уже зарегистрирован. ${error}`
        );
        setIsSuccessful(false); // Устанавливаем состояние неуспешной регистрации
        setOpen(true);
      }
    }
  };

  const handleClose = () => {
    setOpen(false);
    if (isSuccessful) {
      navigate("/"); // Перенаправление на главную страницу только при успешной регистрации
    }
  };

  const recoverPassword = () => {
    // Логика восстановления пароля
  };

  return (
    <div className="registration-container">
      <h2>Регистрация</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <input
            type="text"
            name="firstName"
            placeholder="Имя"
            value={formData.firstName}
            onChange={handleChange}
          />
          {errors.firstName && (
            <span className="error">{errors.firstName}</span>
          )}
        </div>

        <div className="form-group">
          <input
            type="text"
            name="lastName"
            placeholder="Фамилия"
            value={formData.lastName}
            onChange={handleChange}
          />
          {errors.lastName && <span className="error">{errors.lastName}</span>}
        </div>

        <div className="form-group">
          <input
            type="email"
            name="email"
            placeholder="Почта"
            value={formData.email}
            onChange={handleChange}
          />
          {errors.email && <span className="error">{errors.email}</span>}
        </div>

        <div className="form-group">
          <InputMask
            mask="+375 99 999 99 99"
            name="phone"
            placeholder="Номер телефона (например, +375 29 XXX XX XX)"
            value={formData.phone}
            onChange={handleChange}
          />
          {errors.phone && <span className="error">{errors.phone}</span>}
        </div>

        <div className="form-group">
          <input
            type="password"
            name="password"
            placeholder="Пароль"
            value={formData.password}
            onChange={handleChange}
          />
          {errors.password && <span className="error">{errors.password}</span>}
        </div>

        <div className="form-group">
          <input
            type="password"
            name="confirmPassword"
            placeholder="Подтверждение пароля"
            value={formData.confirmPassword}
            onChange={handleChange}
          />
          {errors.confirmPassword && (
            <span className="error">{errors.confirmPassword}</span>
          )}
        </div>

        <div className="form-group">
          <CheckBox
            name="isGetNotification"
            checked={formData.isGetNotification}
            onChange={handleChange}
          />
          <span>Получать уведомления</span>
        </div>

        <div className="form-group">
          <CheckBox
            name="isGetNewsletter"
            checked={formData.isGetNewsletter}
            onChange={handleChange}
          />
          <span>Подписка на рассылку</span>
        </div>

        {/* <div className="form-group">
          <button type="button" onClick={recoverPassword}>
            Востановить пароль
          </button>
        </div> */}

        <button type="submit" className="submit-button">
          Зарегистрироваться
        </button>
      </form>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Сообщение</DialogTitle>
        <DialogContent>
          <DialogContentText>{dialogMessage}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            ОК
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default RegistrationForm;
