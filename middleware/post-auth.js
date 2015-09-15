var URL = require('url');

module.exports = function(keycloak) {
  return function(request, response, next) {
    if ( ! request.query.auth_callback ) {
      return next();
    }

    if ( request.query.error ) {
      return keycloak.accessDenied(request,response,next);
    }
    keycloak.getGrantFromCode( request.query.code, request, response )
      .then( function(grant) {
        var urlParts = {
          pathname: request.path,
          query: request.query,
        };

        delete urlParts.query.code;
        delete urlParts.query.auth_callback;
        delete urlParts.query.state;

        var cleanUrl = URL.format( urlParts );

        request.auth.grant = grant;
        try {
          keycloak.authenticated( request );
        } catch (err) {
          console.log( "could not authenticate request: " + err );
        }
        console.log("redirect to:" + cleanUrl);
        response.redirect( cleanUrl );
    }).catch(function (e) {
        console.log("error happend in getGrantFromCode(): " + e);
    });
  };
};
