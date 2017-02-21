require('../components/transform');

exports.GetQueryString = function(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
}

exports.getCookie = function(name) {
    var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
    if (arr = document.cookie.match(reg)) {
        return unescape(arr[2]);
    } else {
        return null;
    }
}

exports.cutTitle = function(str, len) {
    var newLength = 0;
    var newStr = "";
    var chineseRegex = /[^\x00-\xff]/g;
    var singleChar = "";
    var strLength = str.replace(chineseRegex, "**").length;
    for (var i = 0; i < strLength; i++) {
        singleChar = str.charAt(i).toString();
        if (singleChar.match(chineseRegex) != null) {
            newLength += 2;
        } else {
            newLength++;
        }
        if (newLength > len) {
            break;
        }
        newStr += singleChar;
    }
    return newStr;
}

exports.getStyle = function(ele) {
    if (document.getElementById(ele).currentStyle) {
        var cur = document.getElementById(ele).currentStyle;
    } else {
        var cur = document.defaultView.getComputedStyle(document.getElementById(ele), null);
    }
    return cur;
};

exports.setScroll = function() { //评论滚动效果
    var _this = this;
    var commentboxHeight = parseInt(_this.getStyle('commentbox').height);
    var commentListHeight = parseInt(_this.getStyle('commentList').height);
    var list = document.getElementById('commentList');
    if (commentListHeight >= commentboxHeight) {
        var box = document.getElementById('commentbox');
        var curTop = commentListHeight - commentboxHeight;
        transform(list, { translatey: -curTop + 'px' }, '.5s', 'ease-out');
    }
    else{
        transform(list, { translatey: 0 + 'px' }, '.5s', 'ease-out');
    }
};

exports.getScript = function(src, callback) {
    var head = document.getElementsByTagName("head")[0];
    var js = document.createElement("script");
    js.setAttribute("src", src);
    js.onload = js.onreadystatechange = function() {
        if (!this.readyState || this.readyState == "loaded" || this.readyState == "complete") {
            head.removeChild(js);
            if (callback)
                callback();
        }
    }
    head.appendChild(js);
};

exports.formatVideoTime = function(_time) {
    var second = _time / 1;
    var temp = [];
    var s;

    if (second === 0) {
        return "00:00";
    }
    while (second !== 0) {
        s = second % 60;
        if (s < 10) {
            s = "0" + s;
        }
        temp.unshift(s);
        second = Math.floor(second / 60);
    }

    // 如果不足一分钟，则补上分钟
    if (temp.length < 2) {
        temp.unshift("00");
    }
    return temp.join(":");
}