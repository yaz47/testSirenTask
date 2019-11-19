'use strict';

(function () {
  const URL = 'https://echo.htmlacademy.ru';
  const formElem = document.querySelector('.contact__form');

  function onSave() {
    window.renderMsg(window.utils.successTemplate);
  }

  function onError(data) {
    const errorMsg = window.renderMsg(window.utils.errorTemplate);
    errorMsg.querySelector('.error__message').textContent = data;
  }

  function onFormSubmit(evt) {
    evt.preventDefault();
    window.backend.save(URL, new FormData(evt.target), onSave, onError);
    evt.target.reset();
  }

  const LENGTH = {
    MIN: 5,
    MAX: 300
  };
  const messageElem = formElem.querySelector('.contact__textarea');
  const errorMsg = 'Your message must be more then 5 letters and less then 300 letters';

  function validateMessage() {
    if (messageElem.value.length < LENGTH.MIN || messageElem.value.length > LENGTH.MAX) {
      return errorMsg;
    }

    return '';
  }

  function onMessageInput() {
    messageElem.setCustomValidity(validateMessage());
  }

  if (formElem) {
    formElem.addEventListener('submit', onFormSubmit);
  }

  if (messageElem) {
    messageElem.addEventListener('input', onMessageInput);
  }
}());
