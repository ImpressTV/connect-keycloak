
module.exports = function(keycloak) {
  return function(request, response, next) {
    keycloak.getGrant( request, response )
      .then( function(grant) {
        request.auth.grant = grant;
      })
      .then( next )
      .catch( function() {
          console.log("Exception during grant-attacher::getGrant");
        next();
      } );
  };
};
