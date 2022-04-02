import { LocalStorage } from "quasar";

/**
 * Execute a function infinite times in a loop
 * @param {number} timeLoop // The number in milliseconds to execute the action
 * @param {function} callOperation // The function to execute
 */
function notifyMessage(timeLoop, callOperation) {
  setTimeout(() => {
    callOperation();
    notifyMessage(timeLoop, callOperation);
  }, timeLoop);
}

function getTokenFromStorage() {
  return `Bearer ${LocalStorage.getItem("token")}`
}

const connection = "http://192.168.0.19:8080";

export { notifyMessage, getTokenFromStorage, connection };
