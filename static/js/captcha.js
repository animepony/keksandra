var captchaTimers = document.getElementsByClassName('captchaTimer');

var reloading = false;

var updateFunction = function updateElements() {

  var cookies = getCookies();

  if (!cookies.captchaexpiration) {
    setTimeout(updateFunction, 1000);
    return;
  }

  var captchaExpiration = new Date(cookies.captchaexpiration);

  var delta = captchaExpiration.getTime() - new Date().getTime();

  var time = '';

  if (delta > 1000) {
    time = Math.floor(delta / 1000);

    reloading = false;

  } else {

    time = 'Reloading';

    if (!reloading) {

      reloading = true;

      reloadCaptcha();

    }
  }

  for (var i = 0; i < captchaTimers.length; i++) {
    captchaTimers[i].innerHTML = time;
  }

  setTimeout(updateFunction, 1000);

};

updateFunction();
