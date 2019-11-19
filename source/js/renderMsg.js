'use strict';

(function () {
  function renderMsg(template) {
    const msgElem = document.createElement('div');
    msgElem.innerHTML = template;
    msgElem.tabIndex = 0;

    function onEscPress(evt) {
      if (evt.keyCode === window.utils.KEYCODE.ESC) {
        window.utils.mainElem.removeChild(msgElem);
      }
      document.removeEventListener('keydown', onEscPress);
    }

    function onClick() {
      window.utils.mainElem.removeChild(msgElem);
      document.removeEventListener('keydown', onEscPress);
    }

    document.addEventListener('keydown', onEscPress);
    msgElem.addEventListener('click', onClick);

    window.utils.mainElem.appendChild(msgElem);
    msgElem.focus();

    return msgElem;
  }

  window.renderMsg = renderMsg;
}());
