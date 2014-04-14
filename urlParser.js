/**
	@author:rainypin
	@date : 2014/4/11  
*/

!function(w,undefined){

	
	function UrlParser(url) {
		return this.init(url);
	}


	UrlParser.prototype.init = function(url) {
		var _this = this;
		_this.urlMap = {};
		_this.queryStringMap = {};
		_this.doc = w.document;
		_this.oUrl = _this.doc.createElement('a');
		_this.oUrl.href = url;
		_this.parseUrl();
		_this.getQueryString();
		return _this;
	};

	UrlParser.prototype.parseUrl = function() {
		var _this = this,uMap = _this.urlMap,a = _this.oUrl;

		if(!uMap.isParsed) {
			uMap['protocol'] = a.protocol.replace(":","");
			uMap['hostname'] = a.hostname;
			uMap['host'] = a.host;
			uMap['port'] = a.port;
			uMap['pathname'] = a.pathname;
			uMap['search']	= a.search;
			uMap['hash']	= a.hash;
			uMap.isParsed = true;
		}
		
		return uMap;
	};

	UrlParser.prototype.getQueryString = function() {
		var _this = this,
			uMap = _this.urlMap,
			qSMap = _this.queryStringMap,
			qString = uMap['search'] || _this.oUrl.search,
			kvs,kv;

		if(!qSMap.isParsed) {
			if(qString != null && qString !== "") {
				qString = qString.substring(1);
				kvs = qString.split('&');
				for(var i = kvs.length;i--;) {
					kv = kvs[i].split('=');
					qSMap[kv[0]] = kv[1];
				}
				qSMap.isParsed = true;
		   }
		} 
	
		return qSMap;
	};


	UrlParser.prototype.getQueryValue = function(name) {
		return this.queryStringMap[name];
	};

	UrlParser.prototype.getHostName = function() {
		return this.urlMap['hostname'];
	};

	UrlParser.prototype.getProtocol = function() {
		return this.urlMap['protocol'];
	};

	w.UrlParser = UrlParser;
	
}(window,undefined);