module.exports = function(RED) {

	var watson = require('watson-developer-cloud');
	var temp = require('temp');
	temp.track();
	
	var fs = require('fs');
	var fileType = require('file-type');
	var request = require('request');
	
	function VisualRecognitionNode(config) {

		RED.nodes.createNode(this,config);

		this.name = config.name;
                this.classifier = config.classifier;
                this.username = config.username;
                this.password = config.password;
                this.service = config.service;

		var node = this;

		this.on('input', function(msg) {
		  if (!msg.payload) {
		    var message = 'Missing property: msg.payload';
		    node.error(message, msg);
		    return;
		  }

	  	  if (!msg.payload instanceof Buffer || !typeof msg.payload === 'string') {
		    var message = 'Invalid property: msg.payload, must be a URL or a Buffer.';
	 	    node.error(message, msg);
		    return;
		  }

		  var visual_recognition = watson.visual_recognition({
			username: node.username,
			password: node.password,
			version: 'v2-beta',
		  	version_date: '2015-12-02'
		  });


		  var file_extension = function (file) {
		    var ext = '.jpeg';
		    if (typeof file === 'string') {
			var match = file.match(/\.[\w]{3,4}$/i)
			ext = match && match[0]
			// ...for Buffers, we can look at the file header.
		    } else if (file instanceof Buffer) {
			ext = '.' + fileType(file).ext;
		    }
	  	    return ext;
		  }


		  var stream_buffer = function (file, contents, cb) {
		    fs.writeFile(file, contents, function (err) {
			if (err) throw err;
			cb();
		    });
		  };


		  var stream_url = function (file, location, cb) { 
		    var wstream = fs.createWriteStream(file)
		    wstream.on('finish', cb);

		    request(location)
		    .pipe(wstream);
		  };

		  var stream_payload = (typeof msg.payload === 'string') ? stream_url : stream_buffer;
		  temp.open({suffix: file_extension(msg.payload)}, function (err, info) {
		    if (err) throw err;

		    stream_payload(info.path, msg.payload, function () {
			node.status({fill:"blue", shape:"dot", text:"requesting"});
			var params = {
			 images_file: fs.createReadStream(info.path),
			 classifier_ids: JSON.stringify(msg.classifiers)
			};
				
			visual_recognition.classify(params, 
				function(err2, response) {
					node.status({});
				   	if (err2)
			    		 node.error(err2);
					else {
					// need to send complete msg back
					 msg.payload = response;
            				 node.send(msg);
					 //node.send({payload: response});
					}
					});
			});
		});
		});
	}
	
	RED.nodes.registerType("watsonVR",VisualRecognitionNode, {
		credentials: {
			username: {type:"text"},
			password: {type:"password"}
			}
	});
}
