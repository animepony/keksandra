var boardUri;

if (!DISABLE_JS) {

  var boardIdentifier = document.getElementById('boardIdentifier');

  if (boardIdentifier) {
    boardUri = boardIdentifier.value;
  }

  document.getElementById('createFormButton').style.display = 'none';
  document.getElementById('createJsButton').style.display = 'inline';

  var proxyBanDiv = document.getElementById('proxyBansDiv');

  for (var j = 0; j < proxyBanDiv.childNodes.length; j++) {
    processProxyBanCell(proxyBanDiv.childNodes[j]);
  }
}

function processProxyBanCell(cell) {

  var button = cell.getElementsByClassName('liftJsButton')[0];
  button.style.display = 'inline';

  button.onclick = function() {
    liftProxyBan(cell.getElementsByClassName('idIdentifier')[0].value);
  };

  cell.getElementsByClassName('liftFormButton')[0].style.display = 'none';

}

function liftProxyBan(proxyBan) {

  apiRequest('liftProxyBan', {
    proxyBanId : proxyBan
  }, function requestComplete(status, data) {

    if (status === 'ok') {

      location.reload(true);

    } else {
      alert(status + ': ' + JSON.stringify(data));
    }
  });
}

function placeProxyBan() {

  var typedIp = document.getElementById('ipField').value.trim();

  var parameters = {
    proxyIp : typedIp
  };

  if (boardUri) {
    parameters.boardUri = boardUri;
  }

  apiRequest('placeProxyBan', parameters,
      function requestComplete(status, data) {

        if (status === 'ok') {

          location.reload(true);

        } else {
          alert(status + ': ' + JSON.stringify(data));
        }
      });

}