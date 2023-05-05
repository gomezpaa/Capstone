function favoriteAlert() {
    if (window.history.replaceState) {
        window.history.replaceState(null, null, window.location.href);
    }
    alert('Article added to favorites!');
}
