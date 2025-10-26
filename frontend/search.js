document.addEventListener('DOMContentLoaded', () => {
  const openSearch = document.getElementById('openSearch');
  const popup = document.getElementById('popup');
  const closePopup = document.getElementById('closePopup');

  openSearch.addEventListener('click', () => {
    popup.style.display = 'flex';
    document.getElementById('search-container').focus();
  });

  closePopup.addEventListener('click', () => {
    popup.style.display = 'none';
  });

  window.addEventListener('click', (e) => {
    if (e.target === popup) {
      popup.style.display = 'none';
    }
  });

  // Mapbox search initialization
  const script = document.getElementById('search-js');
  script.onload = () => {
    mapboxsearch.autofill({
      accessToken: 'pk.eyJ1IjoiY2l2aWMtbGluayIsImEiOiJjbWdwbzd6c2kyY3dyMmpuMnpxMTBrMm13In0.KY2MzBxSk5XV2TcEWe3MQA',
      container: '#search-container'
    });
  };
});