export const saveUserInfo = (name, surname) => {
  localStorage.setItem("name", name);
  localStorage.setItem("surname", surname);
  return {
    type: "SAVE_USER_INFO",
    payload: {
      name,
      surname,
    },
  };
};
