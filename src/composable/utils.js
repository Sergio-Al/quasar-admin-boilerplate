import { LocalStorage } from "quasar";

function getTokenFromStorage() {
  return `Bearer ${LocalStorage.getItem("token")}`
}

export {getTokenFromStorage };
