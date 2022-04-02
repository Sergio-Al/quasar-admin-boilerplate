function validateText(value) {
  return (value && value.length > 0) || "Este campo no debe estar vacio";
}

function validateEmail(value) {
  return (value && value.length > 0) || "Debe ingresar un correo valido";
}

function validateNumber(value) {
  return (
    (value && value.toString().length > 0 && value.toString().length >= 7) ||
    "Debe ingresar un valor válido"
  );
}

export { validateText, validateEmail, validateNumber };
