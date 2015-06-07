var checkBoxes = [];

if (!DISABLE_JS) {

  document.getElementById('deleteJsButton').style.display = 'inline';
  document.getElementById('reportJsButton').style.display = 'inline';

  document.getElementById('reportFormButton').style.display = 'none';
  document.getElementById('deleteFormButton').style.display = 'none';

  var divPostings = document.getElementById('divPostings');

  for (var i = 0; i < divPostings.childNodes.length; i++) {

    processPostingCell(divPostings.childNodes[i]);

  }

}

function processPostingCell(postingCell) {

  for (var i = 0; i < postingCell.childNodes.length; i++) {
    var node = postingCell.childNodes[i];

    if (node.id === 'deletionCheckBox') {
      checkBoxes.push(node);
    }
  }

}

function getSelectedContent() {
  var selectedContent = [];

  for (var i = 0; i < checkBoxes.length; i++) {
    var checkBox = checkBoxes[i];

    if (checkBox.checked) {

      var splitName = checkBox.name.split('-');

      var toAdd = {
        board : splitName[0],
        thread : splitName[1]
      };

      if (splitName.length > 2) {
        toAdd.post = splitName[2];
      }

      selectedContent.push(toAdd);

    }
  }

  return selectedContent;

}

function reportPosts() {

  console.log('report');

  var typedReason = document.getElementById('reportFieldReason').value.trim();

  var toReport = getSelectedContent();

  apiRequest('reportContent', {
    reason : typedReason,
    global : document.getElementById('checkboxGlobal').checked,
    postings : toReport
  }, function requestComplete(status, data) {

    if (status === 'ok') {

      alert('Content reported');

    } else {
      alert(status + ': ' + JSON.stringify(data));
    }
  });
}

function deletePosts() {

  var typedPassword = document.getElementById('deletionFieldPassword').value
      .trim();

  var toDelete = getSelectedContent();

  apiRequest('deleteContent', {
    password : typedPassword,
    postings : toDelete
  }, function requestComplete(status, data) {

    if (status === 'ok') {

      alert('Content deleted');

      window.location.pathname = '/';

    } else {
      alert(status + ': ' + JSON.stringify(data));
    }
  });

}