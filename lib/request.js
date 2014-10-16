var https = require('https');
var url = require('url');

function Request() {
    this.params = null;
    this.limit = 0;
}

Request.prototype.parse = function(args) {
    var queryParams = url.parse(args, true).query;
    this.params = queryParams.user || null;
    this.limit = queryParams.limit || 2;
};

Request.prototype.get = function(user, cb) {

    var options = {
        host: 'api.github.com',
        path: '/users/' + user + '/events/public',
        method: 'GET',
        headers: {
            'User-Agent': 'github-service'
        }
    };

    var req = https.get(options, function(res) {
        res.setEncoding('utf8');
        var data = '';

        res.on('data', function(chunk) {
            data += chunk;
        });

        res.on('end', function() {
            if (res.statusCode !== 200) {
                cb(err, null);
            } else {
                var result = JSON.parse(data);
                if (cb) {
                    return cb(null, result);
                }
                return console.log('something went wrong with the response');
            }
        });
    });

    req.end();

    req.on('error', function(e) {
        console.log(e);
        throw e;
    });
};


module.exports = Request;
