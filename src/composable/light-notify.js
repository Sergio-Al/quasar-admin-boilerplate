import { Notify } from "quasar";

function positiveMessage(title, message) {
  Notify.create({
    name: title,
    caption: message,
    color: "positive",
    icon: "check_circle",
  });
}

function negativeMessage(title, message) {
  Notify.create({
    name: title,
    caption: message,
    color: "negative",
    icon: "warning_amber",
  });
}

export { positiveMessage, negativeMessage };
