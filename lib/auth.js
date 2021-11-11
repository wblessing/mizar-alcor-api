const {
  NetlifyJwtVerifier,
  removeNamespaces,
  claimToArray,
} = require('@serverless-jwt/netlify');

const json = (statusCode, body) => {
  return {
    statusCode,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
    },
    body: JSON.stringify(body),
  };
};

const verifyJwt = NetlifyJwtVerifier({
  issuer: process.env.FUNC_AUTH0_ISSUER,
  audience: process.env.FUNC_AUTH0_AUDIENCE,
  mapClaims: (claims) => {
    const user = claims;
    user.scope = claimToArray(user.scope);
    return user;
  },
});

/**
 * Require the request to be authenticated.
 */
module.exports.requireAuth = verifyJwt;

/**
 * Require the token to contain a certain scope.
 * @param {string} scope
 * @param {*} handler
 */
module.exports.requireScope = (scope, handler) =>
  verifyJwt(async (event, context, cb) => {
    const { claims } = context.identityContext;

    // Require the token to contain a specific scope.
    if (!claims || !claims.scope || claims.scope.indexOf(scope) === -1) {
      return json(403, {
        error: 'access_denied',
        error_description: `Token does not contain the required '${scope}' scope`,
      });
    }

    // Continue.
    return handler(event, context, cb);
  });

/**
 * Require the user to have a specific role.
 * @param {string} role
 * @param {*} handler
 */
module.exports.requireRole = (role, handler) =>
  verifyJwt(async (event, context, cb) => {
    const { claims } = context.identityContext;

    // Require the user to have a specific role.
    if (!claims || !claims.roles || claims.roles.indexOf(role) === -1) {
      return json(403, {
        error: 'access_denied',
        error_description: `User does not have the '${role}' role`,
      });
    }

    // Continue.
    return handler(event, context, cb);
  });

module.exports.getUserId = (claims) => {
  return claims[process.env.FUNC_AUTH0_JWT_NAMESPACE + '/sub'];
};
