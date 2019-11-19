'use strict';

(function () {
  const KEYCODE = {
    ESC: 27,
    ENTER: 13
  };

  const mainElem = document.querySelector('main');
  const errorTemplate = '<div class="error"><p class="error__message">Action failed. Try again later!</p></div>';
  const successTemplate = '<div class="success"><p class="success__message">Your message has been sent!</p></div>';

  window.utils = {
    KEYCODE,
    mainElem,
    errorTemplate,
    successTemplate
  };
}());
