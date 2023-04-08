// set last visit index cookie
function setLastVisitCookie(lastIndex) {
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + 3);
    document.cookie = 'lastVisit=' + lastIndex + '; expires=' + expirationDate.toUTCString() + '; path=/';
}

// set backgound colour cookie
function setBackgroundCookie() {
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + 3);
    document.cookie = 'background=' + $('#hexString').val() + '; expires=' + expirationDate.toUTCString() + '; path=/';
}