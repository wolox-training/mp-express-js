exports.validateEmail = (user, validation) => {
  if (user.email && !user.email.match('^[A-Za-z0-9._%+-]+@wolox.com.ar')) {
    validation.isValid = false;
    validation.messages.push({ message: 'Email invalid' });
  }
};
exports.validateLogin = (user, validation) => {
  if (!(user.password && user.email)) {
    validation.isValid = false;
    validation.messages.push({ message: 'Body request must contain email user and password' });
  }
};
exports.validatePassword = (user, validation) => {
  if (
    user.password &&
    (user.password.length < 8 || !user.password.match('([A-Za-z]+[0-9]+)|([0-9]+[A-Za-z]+)'))
  ) {
    validation.isValid = false;
    validation.messages.push({
      message: 'Password of user must be alphanumeric and 8 characters minimum'
    });
  }
};
