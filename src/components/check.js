(function(doc, win) {
    var isiphone = window.navigator.userAgent.toLowerCase().indexOf('iphone');
    var _rotate = window.orientation;
    _rotate = _rotate == undefined ? 0 : _rotate;
    var docEl = doc.documentElement, 
        resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize',
        recalc = function() {
            var clientWidth = _rotate == 0 ? docEl.clientWidth: isiphone > -1 ? screen.width : screen.height;//screen.width     docEl.clientHeight
            if (!clientWidth) return;
            docEl.style.fontSize = Math.floor(100 * (clientWidth / 1080)) + 'px';
        };
    if (!doc.addEventListener) return;
    doc.addEventListener('DOMContentLoaded', recalc, false);
})(document, window);