function checkPassword(form) {
  password1 = form.password.value;
  password2 = form.passwordRepeat.value;

  if (password1 == '')
    alert("Please enter password");
  else if (password2 == '')
    alert("Please confirm the password");
  else if (password1 != password2) {
    alert("Passwords do not match! Please try again...")
    return false;
  }
  else {
    return true;
  }
}
