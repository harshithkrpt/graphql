import decode from "jwt-decode";
import { LOCAL_STORAGE_TOKEN } from "./constants";

export const getUserName = () => {
  const token = localStorage.getItem(LOCAL_STORAGE_TOKEN);

  const {
    user: { username },
  } = decode(token);
  return username;
};
