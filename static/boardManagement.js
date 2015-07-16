var boardIdentifier;

if (!DISABLE_JS) {

  if (document.getElementById('ownerControlDiv')) {

    document.getElementById('addVolunteerJsButton').style.display = 'inline';
    document.getElementById('transferBoardJsButton').style.display = 'inline';
    document.getElementById('deleteBoardJsButton').style.display = 'inline';
    document.getElementById('saveSettingsJsButton').style.display = 'inline';
    document.getElementById('cssJsButton').style.display = 'inline';

    document.getElementById('cssFormButton').style.display = 'none';
    document.getElementById('saveSettingsFormButton').style.display = 'none';
    document.getElementById('deleteBoardFormButton').style.display = 'none';
    document.getElementById('addVolunteerFormButton').style.display = 'none';
    document.getElementById('transferBoardFormButton').style.display = 'none';

    boardIdentifier = document.getElementById('addVolunteerBoardIdentifier').value;

    var volunteerDiv = document.getElementById('volunteersDiv');

    for (var i = 0; i < volunteerDiv.childNodes.length; i++) {
      processVolunteerCell(volunteerDiv.childNodes[i]);

    }
  }

  setupReportButtons();

}

function makeCssRequest(files) {
  apiRequest('setCustomCss', {
    files : files || [],
    boardUri : boardIdentifier,
  }, function requestComplete(status, data) {

    document.getElementById('files').type = 'text';
    document.getElementById('files').type = 'file';

    if (status === 'ok') {

      if (files) {
        alert('New CSS set.');
      } else {
        alert('CSS deleted.');
      }

    } else {
      alert(status + ': ' + JSON.stringify(data));
    }
  });
}

function setCss() {

  var file = document.getElementById('files').files[0];

  if (!file) {
    makeCssRequest();
    return;
  }

  var reader = new FileReader();

  reader.onloadend = function(e) {

    // style exception, too simple
    makeCssRequest([ {
      name : file.name,
      content : reader.result
    } ]);
    // style exception, too simple

  };

  reader.readAsDataURL(file);

}

function saveSettings() {
  var typedName = document.getElementById('boardNameField').value.trim();
  var typedDescription = document.getElementById('boardDescriptionField').value
      .trim();
  var typedAnonymousName = document.getElementById('anonymousNameField').value
      .trim();

  if (!typedName.length || !typedName.length) {
    alert('Both name and description are mandatory.');
    return;
  }

  var settings = [];

  if (document.getElementById('disableIdsCheckbox').checked) {
    settings.push('disableIds');
  }

  if (document.getElementById('disableCaptchaCheckbox').checked) {
    settings.push('disableCaptcha');
  }

  if (document.getElementById('forceAnonymityCheckbox').checked) {
    settings.push('forceAnonymity');
  }

  apiRequest('setBoardSettings', {
    boardName : typedName,
    anonymousName : typedAnonymousName,
    boardDescription : typedDescription,
    boardUri : boardIdentifier,
    settings : settings
  }, function requestComplete(status, data) {

    if (status === 'ok') {

      location.reload(true);

    } else {
      alert(status + ': ' + JSON.stringify(data));
    }
  });

}

function processVolunteerCell(cell) {
  var button = cell.getElementsByClassName('removeJsButton')[0];
  button.style.display = 'inline';
  cell.getElementsByClassName('removeFormButton')[0].style.display = 'none';

  button.onclick = function() {
    setVolunteer(cell.getElementsByClassName('userIdentifier')[0].value, false);
  };

}

function addVolunteer() {
  setVolunteer(document.getElementById('addVolunteerFieldLogin').value.trim(),
      true);
}

function setVolunteer(user, add) {

  apiRequest('setVolunteer', {
    login : user,
    add : add,
    boardUri : boardIdentifier
  }, function requestComplete(status, data) {

    if (status === 'ok') {

      location.reload(true);

    } else {
      alert(status + ': ' + JSON.stringify(data));
    }
  });

}

function transferBoard() {

  apiRequest('transferBoardOwnership', {
    login : document.getElementById('transferBoardFieldLogin').value.trim(),
    boardUri : boardIdentifier
  }, function requestComplete(status, data) {

    if (status === 'ok') {

      window.location.pathname = '/' + boardIdentifier + '/';

    } else {
      alert(status + ': ' + JSON.stringify(data));
    }
  });

}

function deleteBoard() {
  apiRequest('deleteBoard', {
    boardUri : boardIdentifier
  }, function requestComplete(status, data) {

    if (status === 'ok') {

      window.location.pathname = '/';

    } else {
      alert(status + ': ' + JSON.stringify(data));
    }
  });

}