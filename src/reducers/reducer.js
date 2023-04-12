const initialState = {
  name: "",
  surname: "",
};

export const userInfoReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SAVE_USER_INFO":
      return {
        name: action.payload.name,
        surname: action.payload.surname,
      };
    default:
      return state;
  }
};
