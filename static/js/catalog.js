if (!DISABLE_JS) {

  var postingForm = document.getElementById('postingForm');

  if (postingForm) {

    var toggleLink = document.getElementById('togglePosting');
    toggleLink.style.display = 'block';
    postingForm.style.display = 'none';

    toggleLink.onclick = function() {
      toggleLink.style.display = 'none';
      postingForm.style.display = 'block';
    };
  }

}