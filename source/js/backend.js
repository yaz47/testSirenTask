'use strict';

(function () {
  const STATUS_OK = 200;

  function initXHR(onLoad, onError) {
    const xhr = new XMLHttpRequest();

    xhr.addEventListener('load', () => {
      if (xhr.status === STATUS_OK) {
        onLoad(xhr.response);
      } else {
        onError('Response status: ' + xhr.status + ' ' + xhr.statusText);
      }
    });

    xhr.addEventListener('error', () => {
      window.renderMsg(window.utils.errorTemplate);
    });
    return xhr;
  }

  function save(url, data, onLoad, onError) {
    const xhr = initXHR(onLoad, onError);
    xhr.open('POST', url);
    xhr.send(data);
    xhr.responseType = 'json';
  }

  window.backend = {
    save
  };
}());
