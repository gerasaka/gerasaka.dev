(function () {
  try {
    var theme = localStorage.getItem('theme');
    if (['light', 'dark', 'sepia'].includes(theme)) {
      document.documentElement.dataset.theme = theme;
    }
  } catch (e) {
    /* localStorage unavailable */
  }
})();
