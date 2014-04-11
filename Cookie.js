!function(w,undefined) {

function Cookie() {
    return this.init();
}

Cookie.prototype.init = function() {
	console.log('w:' + w);
	var _this = this;
	_this.doc = w.document;
	_this.escape = w.escape;
	_this.unescape = w.unescape;		

	return _this;
};	
Cookie.prototype.setCookie = function(cName,cValue,cExpiresDays) {
	var exdate = new Date();　　　　
	exdate.setDate(exdate.getDate() + cExpiresDays);　
	if(cName == null) {
		throw new Error("cookie name can't empty!");
	} else {
		this.doc.cookie = cName + "=" + this.escape(cValue) + ((cExpiresDays == null) ? "" : ";expires=" + exdate.toGMTString());　　　
	}　　
};

Cookie.prototype.getCookie = function(cName) {
	var _value = "",
		_cStart,
		_cEnd,
		doc = this.doc,
		cookie = doc.cookie;
	if(cName != null && cName !== "" && cookie.length > 0) {
		_cStart = cookie.indexOf(cName + "=");
		if(_cStart != -1) {
			_cStart += (cName + "=").length;
			_cEnd = cookie.indexOf(";",_cStart);
			if(_cEnd == -1) {
				_cEnd = cookie.length;
			}
			_value = this.unescape(cookie.substring(_cStart, _cEnd));
		}
	}
	return _value;
};

Cookie.prototype.deleteCookie = function(cName) {
	var exdate = new Date();
    exdate.setTime(exdate.getTime() - 1);
    var cval=this.getCookie(cName);
    if(cval!=null) this.doc.cookie= cName + "="+cval+";expires="+exdate.toGMTString();
}

w.Cookie = new Cookie();

}(window,undefined);