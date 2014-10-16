var Request = require('./request');
var request = new Request();
var Parallel = require('./parallel');

//Hold on to onRequest callback in server.js
var renderCallBack;

function buildQuery(url) {
    return request.parse(url);
}

//Checks to see if param passed are single or multiple in order to make required request
// This is defintely something that can be refactored and has a lot of edge cases
function checkParams(cb) {
    if (Array.isArray(request.params)) {
	      //since were limiting to two request we're only taking first two items from params array
        makeRequests(request.params.slice(0, 2));
    } else {
        if (typeof request.params === 'string') {
            makeSingleRequest(request.params);
        }
    }
}

function makeSingleRequest(user) {
    request.get(user, function(err, result) {
        if (err) {
            console.log(err, null);
            cb(err, null);
            return;
        }
        return renderCallBack(null, result);
    });
}

//make multiple request but render when they are done.
function makeRequests(users, cb) {
  var parallel = new Parallel();
    users.forEach(function(user) {
        parallel.add(function(done) {
            request.get(user, function(err, res) {
                if (err) return done(err);
                done(null, res);
            });
        });
    });

    parallel.done(function(err, result) {
        var error = { message: 'Something went wrong, please try again later' };
        if (err) renderCallBack(error, null);
        return renderCallBack(null, result);
    });
}

var getUserEvents = function getUserEvents(req, cb) {
    renderCallBack = cb;
    buildQuery(req.url);
    checkParams();
};

module.exports = getUserEvents;
