var util = require('util');
var debuglog = util.debuglog('keycloakCookieStore');

var CookieStore = function(){

    var self = this;
    var TOKEN_KEY = 'keycloak-token';

    self.getId = function (request) {

        // return cookie id
        return 0; // just return something, it will not be used by cookieStore - but this call needs to be implemented.
    }

    self.get = function(request) {

        // return token from cookie
        debuglog("get() called");
        var value;
        if (request && request.cookies) {
            value = request.cookies[ TOKEN_KEY ];
        }
        if ( value ) {
          try {
              debuglog("get() return with value: " + value );
            return JSON.parse( value );
          } catch (err) {
            return null;
          }
        }
    }

    self.clear = function (sessionId) {

        // invalidate session - just ignore this as we do not store sessions in server side
    }

    self.wrap = function (grant) {

        grant.store = function (req, resp) {

            // store grant.__raw in the cookie as token
            debuglog("store called");
            resp.cookie( TOKEN_KEY, JSON.stringify( grant.__raw ) );
        };

        grant.unstore = function(req, resp) {

            // delete tokenId from cookie
            debuglog("unstore called");
            resp.clearCookie( TOKEN_KEY );
        };
    }
};


module.exports = CookieStore;
