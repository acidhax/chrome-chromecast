function urljoin(str) {
  function normalize (str) {
    return str
        .replace(/[\/]+/g, '/')
        .replace(/\/\?/g, '?')
        .replace(/\/\#/g, '#')
        .replace(/\:\//g, '://');
	}
	var joined = [].slice.call(arguments, 0).join('/');
	return normalize(joined);
}
function toArray(list, index) {
    var array = []

    index = index || 0

    for (var i = index || 0; i < list.length; i++) {
        array[i - index] = list[i]
    }

    return array
}
function Device(opt) {
	EventEmitter.call(this);
	this.types = ['generic'];
	this.name = opt.name;
	this.info = opt.info;
	this.address = opt.address;
	this.port = opt.port;
	this.appsBase = opt.appsBase;
	this.httpBase = opt.httpBase;
	this._apps = {};
}
Device.prototype = Object.create(EventEmitter.prototype);

Device.prototype.app = function(appName) {
	if (!this._apps[appName]) {
		this._apps[appName] = new this.App(this, appName);
	}
	return this._apps[appName];
};

Device.prototype.is = function(deviceName) {
	return this.types.indexOf(deviceName.toLowerCase()) !== -1;
};

Device.prototype.url = function() {
	var args = toArray(arguments);
  args.unshift(this.httpBase);

  return urljoin.apply(null, toArray(args));
};

Device.prototype.App = App;

module.exports = Device;