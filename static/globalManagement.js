if (!DISABLE_JS) {
  document.getElementById('addJsButton').style.display = 'inline';
  document.getElementById('deleteFromIpJsButton').style.display = 'inline';

  document.getElementById('deleteFromIpFormButton').style.display = 'none';
  document.getElementById('addFormButton').style.display = 'none';

  setupReportButtons();

  var staffDiv = document.getElementById('divStaff');

  for (var i = 0; i < staffDiv.childNodes.length; i++) {
    var cell = staffDiv.childNodes[i];

    processCell(cell);

  }

}

function processCell(cell) {

  var button = cell.getElementsByClassName('saveJsButton')[0];
  button.style.display = 'inline';

  cell.getElementsByClassName('saveFormButton')[0].style.display = 'none';

  var comboBox = cell.getElementsByClassName('roleCombo')[0];
  var user = cell.getElementsByClassName('userIdentifier')[0].value;

  button.onclick = function() {
    saveUser(user, comboBox);
  };
}

function deleteFromIp() {

  var typedIp = document.getElementById('ipField').value.trim();
  var typedBoards = document.getElementById('fieldBoards').value.trim();

  if (!typedIp.length) {
    alert('An ip is mandatory');
    return;
  }

  apiRequest('deleteFromIp', {
    ip : typedIp,
    boards : typedBoards
  }, function requestComplete(status, data) {

    if (status === 'ok') {

      document.getElementById('ipField').value = '';
      document.getElementById('fieldBoards').value = '';

      alert('Postings deleted.');

    } else {
      alert(status + ': ' + JSON.stringify(data));
    }
  });

}

function saveUser(user, comboBox) {

  setUser(user, comboBox.options[comboBox.selectedIndex].value);

}

function addUser() {

  var combo = document.getElementById('newStaffCombo');

  setUser(document.getElementById('fieldLogin').value.trim(),
      combo.options[combo.selectedIndex].value);

}

function setUser(login, role) {

  apiRequest('setGlobalRole', {
    login : login,
    role : +role
  }, function requestComplete(status, data) {

    if (status === 'ok') {

      location.reload(true);

    } else {
      alert(status + ': ' + JSON.stringify(data));
    }
  });

}
