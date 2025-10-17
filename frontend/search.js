const openSearch = document.getElementById('openSearch');
const popup = document.getElementById('popup');
const closePopup = document.getElementById('closePopup');

openSearch.addEventListener('click', () => {
  popup.style.display = 'flex';
  document.querySelector('.search-input').focus();
});

closePopup.addEventListener('click', () => {
  popup.style.display = 'none';
});

// Optional: close when clicking outside popup box
window.addEventListener('click', (e) => {
  if (e.target === popup) {
    popup.style.display = 'none';
  }
});