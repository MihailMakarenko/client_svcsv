import "./Counter.css";
import { useState } from "react";

function Counter(props) {
  const { countValue, onCountChange, countName, Text } = props;
  const [count, setCount] = useState(countValue); // Используем переданное значение

  const handleDecrease = () => {
    const newCount = count > 9 ? count - 1 : 9;
    setCount(newCount);
    onCountChange(newCount); // Обновляем состояние в родителе
  };

  const handleIncrease = () => {
    const newCount = count < 55 ? count + 1 : 55;
    setCount(newCount);
    onCountChange(newCount); // Обновляем состояние в родителе
  };

  return (
    <div className="form-group">
      <label htmlFor={Text}>
        {countName}: {count}
      </label>
      <button type="button" className="ButtonCounter" onClick={handleDecrease}>
        Отнять
      </button>
      <button type="button" className="ButtonCounter" onClick={handleIncrease}>
        Добавить
      </button>
    </div>
  );
}

export default Counter;
