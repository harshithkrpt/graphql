import decode from "jwt-decode";
import { LOCAL_STORAGE_TOKEN } from "./constants";

export const getUserId = () => {
  const token = localStorage.getItem(LOCAL_STORAGE_TOKEN);

  const {
    user: { id },
  } = decode(token);
  return id;
};
