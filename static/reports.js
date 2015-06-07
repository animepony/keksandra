function setupReportButtons() {

  var reportDiv = document.getElementById('reportDiv');

  for (var j = 0; j < reportDiv.childNodes.length; j++) {
    processReportCell(reportDiv.childNodes[j]);
  }
}

function processReportCell(cell) {
  var button;
  var report;

  for (var j = 0; j < cell.childNodes.length; j++) {
    var node = cell.childNodes[j];

    switch (node.id) {
    case 'closeJsButton':
      button = node;
      node.style.display = 'inline';
      break;
    case 'closeFormButton':
      node.style.display = 'none';
      break;
    case 'idIdentifier':
      report = node.value;
      break;
    }

  }

  button.onclick = function() {
    closeReport(report);
  };
}

function closeReport(report) {
  apiRequest('closeReport', {
    reportId : report
  }, function requestComplete(status, data) {

    if (status === 'ok') {

      location.reload(true);

    } else {
      alert(status + ': ' + JSON.stringify(data));
    }
  });

}