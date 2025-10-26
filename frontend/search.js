document.addEventListener('DOMContentLoaded', () => {
  const openSearch = document.getElementById('openSearch');
  const popup = document.getElementById('popup');
  const closePopup = document.getElementById('closePopup');
  const searchInput = document.getElementById('search-container');

  // Open the popup
  if (openSearch && popup) {
    openSearch.addEventListener('click', () => {
      popup.style.display = 'flex';
      if (searchInput) searchInput.focus();
    });
  }

  // Close the popup
  if (closePopup && popup) {
    closePopup.addEventListener('click', () => {
      popup.style.display = 'none';
    });
  }

  // Close when clicking outside the box
  window.addEventListener('click', (e) => {
    if (e.target === popup) {
      popup.style.display = 'none';
    }
  });

  // Initialize Mapbox search after the Mapbox script loads
  const mapboxScript = document.getElementById('search-js');
  if (mapboxScript) {
    mapboxScript.onload = () => {
      if (searchInput && window.mapboxsearch) {
        mapboxsearch.autofill({
          accessToken: 'pk.eyJ1IjoiY2l2aWMtbGluayIsImEiOiJjbWdwbzd6c2kyY3dyMmpuMnpxMTBrMm13In0.KY2MzBxSk5XV2TcEWe3MQA',
          container: '#search-container'
        });
      }
    };
  }
});