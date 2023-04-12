import styles from "./login.module.css";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { saveUserInfo } from "../../actions/action";
import { useState } from "react";

export default function Login() {
  const [name, setName] = useState(localStorage.getItem("name") || "");
  const [surname, setSurname] = useState(localStorage.getItem("surname") || "");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleClick = (e) => {
    e.preventDefault();
    localStorage.setItem("name", name);
    localStorage.setItem("surname", surname);
    dispatch(saveUserInfo(name, surname));
    navigate("/abacus");
  };

  return (
    <div className={styles.container}>
      <div className={styles.container__inner}>
        <img
          className={styles.container__mainLogo}
          src={process.env.PUBLIC_URL + "/morpalogo.jpg"}
          alt="Morpa Kampüs logo"
        />
        <h1 className={styles.container__mainTitle}>
          Morpa Kampüs'e Hoş Geldiniz!
        </h1>
        <form onClick={(e) => e.stopPropagation()}>
          <div className={styles.container__nameInputDiv}>
            <label className={styles.nameInputDiv__nameLabel} htmlFor="isim">
              İsim
            </label>
            <input
              type="text"
              className={styles.nameInputDiv__nameInput}
              name="isim"
              id="isim"
              placeholder="Lütfen İsminizi Giriniz"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className={styles.container__surnameInputDiv}>
            <label
              className={styles.surnameInputDiv__surnameLabel}
              htmlFor="soyad"
            >
              Soyad
            </label>
            <input
              type="text"
              className={styles.surnameInputDiv__surnameInput}
              name="soyad"
              id="soyad"
              placeholder="Lütfen Soyadınızı Giriniz"
              required
              value={surname}
              onChange={(e) => setSurname(e.target.value)}
            />
          </div>
          <button onClick={handleClick} className={styles.container__signInBtn}>
            Giriş Yap
          </button>
        </form>
      </div>
    </div>
  );
}
