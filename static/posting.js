var loadedPreviews = [];
var loadingPreviews = [];
var loadedContent = {};
var quoteReference = {};

var playableTypes = [ 'video/webm', 'audio/mpeg', 'video/mp4', 'video/ogg',
    'audio/ogg', 'audio/webm' ];

var videoTypes = [ 'video/webm', 'video/mp4', 'video/ogg' ];

if (!DISABLE_JS) {

  document.getElementById('deleteJsButton').style.display = 'inline';
  document.getElementById('reportJsButton').style.display = 'inline';

  if (!board && document.getElementById('inputBan')) {

    document.getElementById('banJsButton').style.display = 'inline';
    document.getElementById('spoilJsButton').style.display = 'inline';

    document.getElementById('inputBan').style.display = 'none';
    document.getElementById('inputSpoil').style.display = 'none';
  }

  document.getElementById('reportFormButton').style.display = 'none';
  document.getElementById('deleteFormButton').style.display = 'none';

  var imageLinks = document.getElementsByClassName('imgLink');

  var fuckYou = [];

  for (i = 0; i < imageLinks.length; i++) {
    fuckYou.push(imageLinks[i]);
  }

  for (i = 0; i < fuckYou.length; i++) {
    processImageLink(fuckYou[i]);
  }

  var quotes = document.getElementsByClassName('quoteLink');

  for (var i = 0; i < quotes.length; i++) {
    var quote = quotes[i];

    processQuote(quote);
  }
}

/* Expanded images have the class 'imgExpanded' */
function setClickableImage(link) {
  link.onclick = function(mouseEvent) {
    return expandImage(mouseEvent, link);
  };
}

/* mouseEvent.target -> link */
function expandImage(mouseEvent, link) {
  /* return: false -> Don't follow link, true -> Follow link */

  /*
   * If event was fired by middle mouse button or combined with the ctrl key,
   * act as a normal link
   */
  if (mouseEvent.which === 2 || mouseEvent.ctrlKey) {
    return true;
  }

  var thumb = link.getElementsByTagName('img')[0];

  /* If image is expanded */
  if (thumb.style.display === 'none') {
    link.getElementsByClassName('imgExpanded')[0].style.display = 'none';
    thumb.style.display = '';
    return false;
  }

  /* Click animation could be inserted here */

  var expanded = link.getElementsByClassName('imgExpanded')[0];

  /*
   * If image has already been expanded in the past, don't create another <img>
   */
  if (expanded) {
    thumb.style.display = 'none';
    expanded.style.display = '';
    return false;
  } else {
    var expandedSrc = link.href;

    /* If the thumb is the same image as the source, do nothing */
    if (thumb.src === expandedSrc) {
      return false;
    }

    expanded = document.createElement('img');
    expanded.setAttribute('src', expandedSrc);
    expanded.setAttribute('class', 'imgExpanded');

    thumb.style.display = 'none';
    link.appendChild(expanded);
    return false;
  }
}

function setPlayer(link, mime) {

  var path = link.href;
  var parent = link.parentNode;

  var src = document.createElement('source');
  src.setAttribute('src', link.href);
  src.setAttribute('type', mime);

  var video = document.createElement(videoTypes.indexOf(mime) > -1 ? 'video'
      : 'audio');
  video.setAttribute('controls', true);
  video.style.display = 'none';

  var videoContainer = document.createElement('span');

  var hideLink = document.createElement('a');
  hideLink.innerHTML = '[ - ]';
  hideLink.style.cursor = 'pointer';
  hideLink.style.display = 'none';
  hideLink.setAttribute('class', 'hideLink');
  hideLink.onclick = function() {
    newThumb.style.display = 'inline';
    video.style.display = 'none';
    hideLink.style.display = 'none';
    video.pause();
  };

  var newThumb = document.createElement('img');
  newThumb.src = link.childNodes[0].src;
  newThumb.onclick = function() {
    if (!video.childNodes.count) {
      video.appendChild(src);
    }

    newThumb.style.display = 'none';
    video.style.display = 'inline';
    hideLink.style.display = 'inline';
    video.play();
  };
  newThumb.style.cursor = 'pointer';

  videoContainer.appendChild(hideLink);
  videoContainer.appendChild(video);
  videoContainer.appendChild(newThumb);

  parent.replaceChild(videoContainer, link);
}

function processImageLink(link) {

  var mime = link.dataset.filemime;

  if (mime.indexOf('image/') > -1) {

    setClickableImage(link);

  } else if (playableTypes.indexOf(mime) > -1) {
    setPlayer(link, mime);
  }
}

function processQuote(quote) {

  var tooltip = document.createElement('div');
  tooltip.style.display = 'none';
  tooltip.style['background-color'] = '#cccccc';
  tooltip.style.position = 'absolute';

  quote.parentNode.appendChild(tooltip);

  var quoteUrl = quote.href;

  if (loadedPreviews.indexOf(quoteUrl) > -1) {
    tooltip.innerHTML = loadedContent[quoteUrl];
  } else {
    var referenceList = quoteReference[quoteUrl] || [];

    referenceList.push(tooltip);

    quoteReference[quoteUrl] = referenceList;
    tooltip.innerHTML = 'Loading';
  }

  quote.onmouseenter = function() {
    var rect = quote.getBoundingClientRect();

    var previewOrigin = {
      x : rect.right + 10 + window.scrollX,
      y : rect.top + window.scrollY
    };

    tooltip.style.left = previewOrigin.x + 'px';
    tooltip.style.top = previewOrigin.y + 'px';
    tooltip.style.display = 'inline';

    if (loadedPreviews.indexOf(quoteUrl) < 0
        && loadingPreviews.indexOf(quoteUrl) < 0) {
      loadQuote(tooltip, quoteUrl);
    }

  };

  quote.onmouseout = function() {
    tooltip.style.display = 'none';
  };

  if (!board) {
    var matches = quote.href.match(/\#(\d+)/);

    quote.onclick = function() {
      markPost(matches[1]);
    };
  }

}

function loadQuote(tooltip, quoteUrl) {

  var matches = quoteUrl.match(/\/(\w+)\/res\/\d+\.html\#(\d+)/);

  var board = matches[1];
  var post = matches[2];

  var previewUrl = '/' + board + '/preview/' + post + '.html';

  localRequest(previewUrl, function receivedData(error, data) {
    if (error) {
      loadingPreviews.splice(loadingPreviews.indexOf(quoteUrl), 1);
    } else {

      var referenceList = quoteReference[quoteUrl];

      for (var i = 0; i < referenceList.length; i++) {
        referenceList[i].innerHTML = data;
      }

      loadedContent[quoteUrl] = data;
      loadedPreviews.push(quoteUrl);
      loadingPreviews.splice(loadingPreviews.indexOf(quoteUrl), 1);
    }
  });

  loadingPreviews.push(quoteUrl);

}

function spoilFiles() {
  
  apiRequest('spoilFiles', {
    postings : getSelectedContent()
  }, function requestComplete(status, data) {

    if (status === 'ok') {

      alert('Files spoiled');

    } else {
      alert(status + ': ' + JSON.stringify(data));
    }
  });
  
}

function banPosts() {
  var typedReason = document.getElementById('reportFieldReason').value.trim();
  var typedExpiration = document.getElementById('fieldExpiration').value.trim();
  var typedMessage = document.getElementById('fieldbanMessage').value.trim();

  var expiration = Date.parse(typedExpiration || '');

  if (isNaN(expiration)) {
    alert('Invalid expiration');

    return;
  }

  var toBan = getSelectedContent();

  apiRequest('banUsers', {
    reason : typedReason,
    expiration : typedExpiration,
    banMessage : typedMessage,
    global : document.getElementById('checkboxGlobal').checked,
    postings : toBan
  }, function requestComplete(status, data) {

    if (status === 'ok') {

      alert('Bans applied');

    } else {
      alert(status + ': ' + JSON.stringify(data));
    }
  });
}

function getSelectedContent() {
  var selectedContent = [];

  var checkBoxes = document.getElementsByClassName('deletionCheckBox');

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

  var typedReason = document.getElementById('reportFieldReason').value.trim();
  var typedCaptcha = document.getElementById('fieldCaptchaReport').value.trim();

  var toReport = getSelectedContent();

  if (typedCaptcha.length !== 6 && typedCaptcha.length !== 24) {
    alert('Captchas are exactly 6 (24 if no cookies) characters long.');
    return;
  } else if (/\W/.test(typedCaptcha)) {
    alert('Invalid captcha.');
    return;
  }

  console.log(typedCaptcha);

  apiRequest('reportContent', {
    reason : typedReason,
    captcha : typedCaptcha,
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
    deleteUploads : document.getElementById('checkboxOnlyFiles').checked,
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
