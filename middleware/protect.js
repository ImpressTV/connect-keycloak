var UUID = require('./../uuid' );

function forceLogin(keycloak, request, response) {
  var host = request.hostname;
  var port = request.app.settings.port || 3000;

  var redirectUrl = 'http://' + host + ( port == 80 ? '' : ':' + port ) + request.url + '?auth_callback=1';
  request.session.auth_redirect_uri = redirectUrl;

  var uuid = UUID();
  var loginURL = keycloak.loginUrl( uuid, redirectUrl );
  response.redirect( loginURL );
}

function simpleGuard(role,token) {
  if ( role.indexOf( "app:" ) === 0 ) {
    return token.hasApplicationRole( role.substring( 4 ) );
  }
  if ( role.indexOf( "realm:" ) === 0 ) {
    return token.hasRealmRole( role.substring( 6 ) );
  }

  return false;
}

module.exports = function(keycloak, spec) {

  var guard;

  if ( typeof spec == 'function' ) {
    guard = spec;
  } else if ( typeof spec == 'string' ) {
    guard = simpleGuard.bind(undefined, spec);
  }

  return function(request, response, next) {
    if ( response.locals.grant ) {
      if ( ! guard || guard( response.locals.grant.access_token, request, response ) ) {
        return next();
      }

      response.status( 403 );
      response.end( "Access denied" );
      return;
    }

    forceLogin(keycloak, request, response);
  };
};
