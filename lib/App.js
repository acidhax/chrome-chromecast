function App(device, appName) {
	EventEmitter.call(this);
	this.name = appName;
	this.device = device;
	this.base = this.device.appsBase+this.name;
}
App.prototype = Object.create(EventEmitter.prototype);

App.prototype.info = function(cb) {
	var request = superagent.get(this.base);
	request.buffer();
	request.type('xml');

	request.end(function(err, res) {
		if (err) return cb(err);
		var parsed = XML2JSON.parse(res.text);
		cb(null, parsed.service);
	});
	return this;
};

App.prototype.start = function(data, cb) {
	var request = superagent.post(this.base);
	request.buffer();

	// support sending with data
	// the spec says this is up to the app so we support json and text
	if (typeof data === 'function') {
		cb = data;
		data = null;
	} else if (typeof data === 'string') {
		request.type('text');
		request.send(data);
	} else if (typeof data === 'object') {
		request.type('json');
		request.send(data);
	}

	request.end(function(err, res){
		if (cb) cb(err);
	});
	return this;
};

App.prototype.stop = function(cb) {
	var request = superagent.del(this.base);
	request.buffer();

	request.end(function(err, res){
		cb(err);
	});
	return this;
};

module.exports = App;
