import { useState, useEffect, useRef } from "react";
import styles from "./abacus.module.css";
import { useSelector } from "react-redux";

export default function Abacus() {
  const [values, setValues] = useState(Array(9).fill(0));
  const [totalNumber, setTotalNumber] = useState("sıfır");

  useEffect(() => {
    const savedData = JSON.parse(localStorage.getItem("data"));

    if (savedData) {
      setValues(savedData.values);
      setTotalNumber(savedData.totalNumber);
    }
  }, []);

  const prevValues = useRef(values);
  const prevTotalNumber = useRef(totalNumber);

  useEffect(() => {
    if (
      prevValues.current !== values ||
      prevTotalNumber.current !== totalNumber
    ) {
      localStorage.setItem("data", JSON.stringify({ values, totalNumber }));
      prevValues.current = values;
      prevTotalNumber.current = totalNumber;
    }
  }, [values, totalNumber]);

  let name = useSelector((state) => state.name);
  let surname = useSelector((state) => state.surname);

  const savedName = localStorage.getItem("name");
  const savedSurname = localStorage.getItem("surname");

  if (savedName && savedSurname) {
    name = savedName;
    surname = savedSurname;
  }

  if (!name || !surname) {
    name = name || "Adınızı Girmediniz";
    surname = surname || "Soyadınızı Girmediniz";
  }

  const calculateTotalNumber = (values) => {
    const number = values.reduce(
      (accumulator, currentValue, index) =>
        accumulator + currentValue * 10 ** (values.length - index - 1),
      0
    );
    return number;
  };

  const convertNumberToWords = (number) => {
    if (number === 0) {
      return "sıfır";
    }

    const ones = [
      "",
      "bir",
      "iki",
      "üç",
      "dört",
      "beş",
      "altı",
      "yedi",
      "sekiz",
      "dokuz",
      "on",
      "on bir",
      "on iki",
      "on üç",
      "on dört",
      "on beş",
      "on altı",
      "on yedi",
      "on sekiz",
      "on dokuz",
    ];

    const tens = [
      "",
      "on",
      "yirmi",
      "otuz",
      "kırk",
      "elli",
      "altmış",
      "yetmiş",
      "seksen",
      "doksan",
    ];

    const scales = ["", "bin", "milyon", "milyar"];

    let scaleIndex = 0;
    let scaleValue = 0;

    let result = "";

    while (number > 0) {
      const lastThreeDigits = number % 1000;
      const lastTwoDigits = lastThreeDigits % 100;
      const digit = Math.floor(lastThreeDigits / 100);

      let words = "";

      if (digit > 0) {
        words += ones[digit] + " yüz ";
      }

      if (lastTwoDigits < 10 || (lastTwoDigits > 10 && lastTwoDigits < 20)) {
        words += ones[lastTwoDigits];
      } else {
        const tensDigit = Math.floor(lastTwoDigits / 10);
        const onesDigit = lastTwoDigits % 10;
        if (onesDigit === 0) {
          words += tens[tensDigit];
        } else {
          words += tens[tensDigit] + " " + ones[onesDigit];
        }
      }

      if (lastThreeDigits > 0 && scaleIndex > 0) {
        if (lastTwoDigits === 0 && digit === 1) {
          words = "yüz ";
        }
        words += " " + scales[scaleIndex];
      }

      if (scaleValue > 0 && lastThreeDigits > 0) {
        words += " ";
      }

      result = words + result;

      number = Math.floor(number / 1000);
      scaleIndex++;
      scaleValue = lastThreeDigits;
    }

    result = result
      .replace("bir yüz", "yüz")
      .replace("bir bin", "bin")
      .replace(
        "yüz on bir milyon bir yüz on bin",
        "yüz on bir milyon yüz on bin"
      )
      .replace("yüz üç milyonbir yüz", "yüz üç milyon yüz")
      .replace("yüz on milyon bir yüz bin bir yüz", "yüz on milyon yüz bin yüz")
      .replace(
        "yüz on milyon bir yüz on bin bir yüz",
        "yüz on milyon yüz on bin yüz"
      )
      .replace("yüz on bin bir yüz on bir", "yüz on bin yüz on bir");

    return result.trim();
  };

  const handleIncrement = (index) => {
    if (values[index] < 9) {
      const newValues = [...values];
      newValues[index] += 1;
      setValues(newValues);
      setTotalNumber(convertNumberToWords(calculateTotalNumber(newValues)));
    }
  };

  const handleDecrement = (index) => {
    if (values[index] > 0) {
      const newValues = [...values];
      newValues[index] -= 1;
      setValues(newValues);
      setTotalNumber(convertNumberToWords(calculateTotalNumber(newValues)));
    }
  };

  const abacusRows = [];
  for (let i = 0; i < 9; i++) {
    const abacusBeads = [];
    for (let j = 0; j < 9; j++) {
      const isActive = values[i] > j;
      const bead = (
        <circle
          key={`${i}-${j}`}
          cx={i * 30 + 20}
          cy={180 - (j * 20 + 15)}
          r={4.5}
          fill={isActive ? "#ed2939" : "#f6f8fc"}
          stroke="black"
          strokeWidth="1"
          style={{ display: values[i] > 0 ? "block" : "none" }}
        />
      );
      abacusBeads.push(bead);
    }
    const row = (
      <g
        key={i}
        transform={`translate(${i * 26.3 + 30 + (9 - values.length) * 26}, 0)`}
      >
        {abacusBeads}
      </g>
    );
    abacusRows.push(row);
  }

  const abacusSticks = Array.from({ length: 9 }, (_, i) => (
    <div key={i} className={styles.abacusStick}></div>
  ));

  return (
    <div className={styles.container}>
      <p
        className={styles.container__userName}
      >{`Hoşgeldiniz ${name} ${surname}`}</p>
      <svg viewBox="0 0 550 200">
        {abacusRows}
        <rect x="0" y="173" width="100%" height="5" fill="gray" />
      </svg>
      <div className={styles.container__totalNumber}>
        <div className={styles.totalNumber__totalNumberTitle}>
          {totalNumber}
        </div>
      </div>
      <div className={styles.container__sticks}>{abacusSticks}</div>
      <div className={styles.container__inputs}>
        {values.map((value, index) => (
          <div className={styles.inputs__inputContainer} key={index}>
            <button
              className={styles.inputContainer__button}
              onClick={() => handleDecrement(index)}
            >
              -
            </button>
            <input
              className={styles.inputContainer__input}
              type="number"
              value={value}
              readOnly
            />
            <button
              className={styles.inputContainer__button}
              onClick={() => handleIncrement(index)}
            >
              +
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
