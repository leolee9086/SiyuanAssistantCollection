export default  {
    encode: function (str) {
        var div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    },
    decode: function (str) {
        var div = document.createElement('div');
        div.innerHTML = str;
        return div.textContent;
    },
    encodeNonUTF: function (str) {
        return str.split('').map(function (c) {
            return '&#' + c.charCodeAt(0) + ';';
        }).join('');
    },
    decodeNonUTF: function (str) {
        return str.replace(/&#(\d+);/g, function (match, dec) {
            return String.fromCharCode(dec);
        });
    }
}