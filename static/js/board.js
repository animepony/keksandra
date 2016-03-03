var board = true;
var originalButtonText;
var boardUri = document.getElementById('boardIdentifier').value;
var hiddenCaptcha;
var selectedFiles = [];
var selectedDiv;

var selectedCell = '<div class="removeButton">✖</div>'
    + '<span class="nameLabel"></span><div class="spoilerPanel">'
    + '<input type="checkbox" class="spoilerCheckBox">Spoiler</div>';

function addSelectedFile(file) {

  var cell = document.createElement('div');
  cell.setAttribute('class', 'selectedCell');

  cell.innerHTML = selectedCell;

  var nameLabel = cell.getElementsByClassName('nameLabel')[0];
  nameLabel.innerHTML = file.name;

  var removeButton = cell.getElementsByClassName('removeButton')[0];
  removeButton.onclick = function() {
    selectedDiv.removeChild(cell);
    selectedFiles.splice(selectedFiles.indexOf(file), 1);
  };

  selectedFiles.push(file);
  selectedDiv.appendChild(cell);

}

function clearSelectedFiles() {
  selectedFiled = [];

  while (selectedDiv.firstChild) {
    selectedDiv.removeChild(selectedDiv.firstChild);
  }
}

function setDragAndDrop() {

  var fileInput = document.getElementById('files')
  fileInput.style.display = 'none';

  document.getElementById('dragAndDropDiv').style.display = 'block';

  var drop = document.getElementById('dropzone');
  drop.onclick = function() {
    fileInput.click();
  };

  fileInput.onchange = function() {

    for (var i = 0; i < fileInput.files.length; i++) {
      addSelectedFile(fileInput.files[i]);
    }

    fileInput.type = "text";
    fileInput.type = "file";
  };

  selectedDiv = document.getElementById('selectedDiv');

  drop.addEventListener('dragover', function handleDragOver(event) {

    event.stopPropagation();
    event.preventDefault();
    event.dataTransfer.dropEffect = 'copy';

  }, false);

  drop.addEventListener('drop', function handleFileSelect(evt) {
    evt.stopPropagation();
    evt.preventDefault();

    for (var i = 0; i < evt.dataTransfer.files.length; i++) {
      addSelectedFile(evt.dataTransfer.files[i])
    }

  }, false);

}

if (!DISABLE_JS) {

  hiddenCaptcha = !document.getElementById('captchaDiv');

  setDragAndDrop();

  var postButton = document.getElementById('jsButton');
  postButton.style.display = 'inline';
  postButton.disabled = false;

  if (document.getElementById('captchaDiv')) {
    document.getElementById('reloadCaptchaButton').style.display = 'inline';

  }

  var savedPassword = getSavedPassword();

  if (savedPassword && savedPassword.length) {
    document.getElementById('fieldPostingPassword').value = savedPassword;
    document.getElementById('deletionFieldPassword').value = savedPassword;
  }

  document.getElementById('reloadCaptchaButtonReport').style.display = 'inline';

  document.getElementById('formButton').style.display = 'none';

}

function reloadCaptcha() {
  document.cookie = 'captchaid=; path=/;';

  if (document.getElementById('captchaDiv')) {
    document.getElementById('captchaImage').src = '/captcha.js#'
        + new Date().toString();
  }

  document.getElementById('captchaImageReport').src = '/captcha.js#'
      + new Date().toString();

}

var postCallback = function requestComplete(status, data) {

  if (status === 'ok') {

    alert('Thread created.');

    window.location.pathname = '/' + boardUri + '/res/' + data + '.html';

  } else {
    alert(status + ': ' + JSON.stringify(data));
  }
};

postCallback.stop = function() {
  postButton.innerHTML = originalButtonText;
  postButton.disabled = false;
};

postCallback.progress = function(info) {

  if (info.lengthComputable) {
    var newText = 'Uploading ' + Math.floor((info.loaded / info.total) * 100)
        + '%';
    postButton.innerHTML = newText;
  }
};

function sendThreadData(files, captchaId) {

  var hiddenFlags = !document.getElementById('flagsDiv');

  if (!hiddenFlags) {
    var combo = document.getElementById('flagCombobox');

    var selectedFlag = combo.options[combo.selectedIndex].value;
  }

  var forcedAnon = !document.getElementById('fieldName');

  if (!forcedAnon) {
    var typedName = document.getElementById('fieldName').value.trim();
  }

  var typedEmail = document.getElementById('fieldEmail').value.trim();
  var typedMessage = document.getElementById('fieldMessage').value.trim();
  var typedSubject = document.getElementById('fieldSubject').value.trim();
  var typedPassword = document.getElementById('fieldPostingPassword').value
      .trim();

  if (!typedMessage.length) {
    alert('A message is mandatory.');
    return;
  } else if (!forcedAnon && typedName.length > 32) {
    alert('Name is too long, keep it under 32 characters.');
    return;
  } else if (typedMessage.length > 4096) {
    alert('Message is too long, keep it under 4096 characters.');
    return;
  } else if (typedEmail.length > 64) {
    alert('Email is too long, keep it under 64 characters.');
    return;
  } else if (typedSubject.length > 128) {
    alert('Subject is too long, keep it under 128 characters.');
    return;
  } else if (typedPassword.length > 8) {
    alert('Password is too long, keep it under 8 characters.');
    return;
  }

  if (typedPassword.length) {
    savePassword(typedPassword);
  }

  originalButtonText = postButton.innerHTML;
  postButton.innerHTML = 'Uploading 0%';
  postButton.disabled = true;

  apiRequest('newThread', {
    name : forcedAnon ? null : typedName,
    flag : hiddenFlags ? null : selectedFlag,
    captcha : captchaId,
    password : typedPassword,
    spoiler : document.getElementById('checkboxSpoiler').checked,
    subject : typedSubject,
    message : typedMessage,
    email : typedEmail,
    files : files,
    boardUri : boardUri
  }, postCallback);

}

function iterateSelectedFiles(currentIndex, files, captchaId) {

  if (currentIndex < selectedFiles.length) {
    var reader = new FileReader();

    reader.onloadend = function(e) {

      files
          .push({
            name : selectedFiles[currentIndex].name,
            content : reader.result,
            spoiler : selectedDiv.getElementsByClassName('spoilerCheckBox')[currentIndex].checked
          });

      iterateSelectedFiles(currentIndex + 1, files, selectedFiles, captchaId);

    };

    reader.readAsDataURL(selectedFiles[currentIndex]);
  } else {
    sendThreadData(files, captchaId);
  }

}

function processFilesToPost(captchaId) {
  iterateSelectedFiles(0, [], captchaId);
}

function postThread() {

  if (hiddenCaptcha) {
    processFilesToPost();
  } else {
    var typedCaptcha = document.getElementById('fieldCaptcha').value.trim();

    if (typedCaptcha.length !== 6 && typedCaptcha.length !== 24) {
      alert('Captchas are exactly 6 (24 if no cookies) characters long.');
      return;
    } else if (/\W/.test(typedCaptcha)) {
      alert('Invalid captcha.');
      return;
    }

    if (typedCaptcha.length == 24) {
      processFilesToPost(typedCaptcha);
    } else {
      var parsedCookies = getCookies();

      apiRequest('solveCaptcha', {

        captchaId : parsedCookies.captchaid,
        answer : typedCaptcha
      }, function solvedCaptcha(status, data) {

        processFilesToPost(parsedCookies.captchaid);

      });
    }

  }

}
