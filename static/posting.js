var loadedPreviews = [];
var loadingPreviews = [];
var quoteReference = {};

var MIMETYPES = {
  a : 'application/octet-stream',
  ai : 'application/postscript',
  aif : 'audio/x-aiff',
  aifc : 'audio/x-aiff',
  aiff : 'audio/x-aiff',
  au : 'audio/basic',
  avi : 'video/x-msvideo',
  bat : 'text/plain',
  bin : 'application/octet-stream',
  bmp : 'image/x-ms-bmp',
  c : 'text/plain',
  cdf : 'application/x-cdf',
  csh : 'application/x-csh',
  css : 'text/css',
  dll : 'application/octet-stream',
  doc : 'application/msword',
  dot : 'application/msword',
  dvi : 'application/x-dvi',
  eml : 'message/rfc822',
  eps : 'application/postscript',
  etx : 'text/x-setext',
  exe : 'application/octet-stream',
  gif : 'image/gif',
  gtar : 'application/x-gtar',
  h : 'text/plain',
  hdf : 'application/x-hdf',
  htm : 'text/html',
  html : 'text/html',
  jpe : 'image/jpeg',
  jpeg : 'image/jpeg',
  jpg : 'image/jpeg',
  js : 'application/x-javascript',
  ksh : 'text/plain',
  latex : 'application/x-latex',
  m1v : 'video/mpeg',
  man : 'application/x-troff-man',
  me : 'application/x-troff-me',
  mht : 'message/rfc822',
  mhtml : 'message/rfc822',
  mif : 'application/x-mif',
  mov : 'video/quicktime',
  movie : 'video/x-sgi-movie',
  mp2 : 'audio/mpeg',
  mp3 : 'audio/mpeg',
  mp4 : 'video/mp4',
  mpa : 'video/mpeg',
  mpe : 'video/mpeg',
  mpeg : 'video/mpeg',
  mpg : 'video/mpeg',
  ms : 'application/x-troff-ms',
  nc : 'application/x-netcdf',
  nws : 'message/rfc822',
  o : 'application/octet-stream',
  obj : 'application/octet-stream',
  oda : 'application/oda',
  pbm : 'image/x-portable-bitmap',
  pdf : 'application/pdf',
  pfx : 'application/x-pkcs12',
  pgm : 'image/x-portable-graymap',
  png : 'image/png',
  pnm : 'image/x-portable-anymap',
  pot : 'application/vnd.ms-powerpoint',
  ppa : 'application/vnd.ms-powerpoint',
  ppm : 'image/x-portable-pixmap',
  pps : 'application/vnd.ms-powerpoint',
  ppt : 'application/vnd.ms-powerpoint',
  pptx : 'application/vnd.ms-powerpoint',
  ps : 'application/postscript',
  pwz : 'application/vnd.ms-powerpoint',
  py : 'text/x-python',
  pyc : 'application/x-python-code',
  pyo : 'application/x-python-code',
  qt : 'video/quicktime',
  ra : 'audio/x-pn-realaudio',
  ram : 'application/x-pn-realaudio',
  ras : 'image/x-cmu-raster',
  rdf : 'application/xml',
  rgb : 'image/x-rgb',
  roff : 'application/x-troff',
  rtx : 'text/richtext',
  sgm : 'text/x-sgml',
  sgml : 'text/x-sgml',
  sh : 'application/x-sh',
  shar : 'application/x-shar',
  snd : 'audio/basic',
  so : 'application/octet-stream',
  src : 'application/x-wais-source',
  swf : 'application/x-shockwave-flash',
  t : 'application/x-troff',
  tar : 'application/x-tar',
  tcl : 'application/x-tcl',
  tex : 'application/x-tex',
  texi : 'application/x-texinfo',
  texinfo : 'application/x-texinfo',
  tif : 'image/tiff',
  tiff : 'image/tiff',
  tr : 'application/x-troff',
  tsv : 'text/tab-separated-values',
  txt : 'text/plain',
  ustar : 'application/x-ustar',
  vcf : 'text/x-vcard',
  wav : 'audio/x-wav',
  webm : 'video/webm',
  wiz : 'application/msword',
  wsdl : 'application/xml',
  xbm : 'image/x-xbitmap',
  xlb : 'application/vnd.ms-excel',
  xls : 'application/vnd.ms-excel',
  xlsx : 'application/vnd.ms-excel',
  xml : 'text/xml',
  xpdl : 'application/xml',
  xpm : 'image/x-xpixmap',
  xsl : 'application/xml',
  xwd : 'image/x-xwindowdump',
  zip : 'application/zip'
};

function getMime(pathName) {

  var pathParts = pathName.split('.');

  var mime;

  if (pathParts.length) {
    var extension = pathParts[pathParts.length - 1];
    mime = MIMETYPES[extension.toLowerCase()] || 'text/plain';

  } else {
    mime = 'text/plain';
  }

  return mime;
};

if (!DISABLE_JS) {

  document.getElementById('deleteJsButton').style.display = 'inline';
  document.getElementById('reportJsButton').style.display = 'inline';

  if (!board && document.getElementById('inputBan')) {

    document.getElementById('banJsButton').style.display = 'inline';

    document.getElementById('inputBan').style.display = 'none';
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

  window.onload = function() {
    var quotes = document.getElementsByClassName('quoteLink');

    for (var i = 0; i < quotes.length; i++) {
      var quote = quotes[i];

      processQuote(quote);
    }
  };

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

  /* If event was fired by middle mouse button or combined with
   * the ctrl key, act as a normal link */
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

  /* If image has already been expanded in the past,
   * don't create another <img> */
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


function setWebm(link) {

  var path = link.href;
  var parent = link.parentNode;

  var src = document.createElement('source');
  src.setAttribute('src', link.href);
  src.setAttribute('type', 'video/webm');

  var video = document.createElement('video');
  video.setAttribute('controls', true);
  video.style.display = 'none';
  video.appendChild(src);

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

  var mime = getMime(link.href);

  if (mime.indexOf('image/') > -1) {

    setClickableImage(link);

  } else if (mime == 'video/webm') {
    setWebm(link);
  }
}

function processQuote(quote) {

  var rect = quote.getBoundingClientRect();

  var previewOrigin = {
    x : rect.right + 10 + window.scrollX,
    y : rect.top + window.scrollY
  };

  var tooltip = document.createElement('div');
  tooltip.style.display = 'none';
  quote.parentNode.appendChild(tooltip);
  tooltip.innerHTML = 'Loading';
  tooltip.style['background-color'] = '#cccccc';

  tooltip.style.position = 'absolute';
  tooltip.style.left = previewOrigin.x + 'px';
  tooltip.style.top = previewOrigin.y + 'px';

  var quoteUrl = quote.href;

  var referenceList = quoteReference[quoteUrl] || [];

  referenceList.push(tooltip);

  quoteReference[quoteUrl] = referenceList;

  quote.onmouseenter = function() {
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

      loadedPreviews.push(quoteUrl);
      loadingPreviews.splice(loadingPreviews.indexOf(quoteUrl), 1);
    }
  });

  loadingPreviews.push(quoteUrl);

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
