import "./AutorizationModal.css";
import React, { useState } from "react";
import Form from "@mui/material/FormControl";
import Input from "@mui/material/Input";
import Label from "@mui/material/FormLabel";
import Button from "@mui/material/Button";
import EmailIcon from "@mui/icons-material/Email";
import KeyIcon from "@mui/icons-material/Key";
import UserServerApi from "../../apiService/userService";
import Alert from "@mui/material/Alert";
import CheckIcon from "@mui/icons-material/Check";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function AutorizationModal({ onClose }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const userServerApi = new UserServerApi();

  const navigate = useNavigate();

  const notify = () => toast("Вход успешно выполнен!");
  const handleRegisterClick = () => {
    navigate("/Registration"); // Переход на страницу регистрации
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    // Простейшая валидация
    if (!email || !password) {
      setError("Пожалуйста, заполните все поля.");
      return;
    }

    try {
      const response = await userServerApi.loginUser(
        email,
        password,
        (successMessage) => {
          console.log(successMessage);
          notify();
          setSuccessMessage(successMessage);
          setIsLoggedIn(true); // Устанавливаем состояние входа в true
        },
        (errorMessage) => {
          setError(errorMessage);
        }
      );

      // Сохраняем токен и имя после успешного ответа
      localStorage.setItem("token", response.token);
      localStorage.setItem("firstName", response.name);
      localStorage.setItem("idUser", response.idUser);
      localStorage.setItem("role", response.role);

      console.log("Аутентификация успешна!", response);
    } catch (error) {
      console.error("Ошибка при входе:", error);
      setError(error.message);
    }
  };

  const handleOk = () => {
    setIsLoggedIn(false); // Закрываем сообщение об успешном входе
    setSuccessMessage(""); // Сбрасываем сообщение
    onClose(); // Закрываем модальное окно
  };

  return (
    <div>
      {!isLoggedIn ? ( // Условный рендеринг формы авторизации
        <form onSubmit={handleSubmit}>
          <h2>Авторизация</h2>
          <div>
            <EmailIcon sx={{ verticalAlign: "middle", paddingRight: 1 }} />
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Label>Электронная почта</Label>
          </div>
          <div>
            <KeyIcon sx={{ verticalAlign: "middle", paddingRight: 1 }} />
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <Label>Пароль</Label>
          </div>
          {error && <p style={{ color: "red" }}>{error}</p>}
          <div className="button-enter">
            <Button
              type="submit"
              variant="contained"
              sx={{
                marginBottom: 2,
                backgroundColor: "#28a745",
                color: "white",
                "&:hover": {
                  backgroundColor: "#218838",
                },
              }}
            >
              Войти
            </Button>
          </div>
          <Button variant="text" onClick={handleRegisterClick}>
            Зарегистрироваться
          </Button>
        </form>
      ) : (
        <Alert
          icon={<CheckIcon fontSize="inherit" />}
          severity="success"
          action={
            <Button color="inherit" size="small" onClick={handleOk}>
              OK
            </Button>
          }
        >
          Вход выполнен успешно!
        </Alert>
      )}
    </div>
  );
}

export default AutorizationModal;
