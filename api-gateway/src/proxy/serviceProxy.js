// const proxy = require("@fastify/http-proxy"); 

// function createServiceProxy({ prefix, target }) { 
//   return async function (fastify) {
//     fastify.register(proxy, {
//       upstream: target,
//       prefix,
//       rewritePrefix: prefix,
//       http2: false
//     });
//   };
// }

// module.exports = createServiceProxy;

const proxy = require("@fastify/http-proxy");

function createServiceProxy({ prefix, target, onRequest }) {
  return async function (fastify) {
    fastify.register(proxy, {
      upstream: target,
      prefix,
      rewritePrefix: prefix,
      http2: false,
      preHandler: onRequest
    });
  };
}

module.exports = createServiceProxy;
