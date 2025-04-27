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

function createServiceProxy({ prefix, target }) {
  return async function (fastify) {
    // 🔎 Log de requisições (opcional)
    fastify.addHook("onRequest", async (request, reply) => {
      console.log(`[GATEWAY][${prefix}] ${request.method} ${request.url}`);
    });

    // 🔁 Registra o proxy reverso
    fastify.register(proxy, {
      upstream: target,
      prefix,
      rewritePrefix: "",
      http2: false
    });
  };
}

module.exports = createServiceProxy;
