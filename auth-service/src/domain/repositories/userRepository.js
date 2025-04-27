/* 
   Interface informal (usada como contrato) 
   Define que registerUser.js deve ter essas funções
   E o server.js deve escolher qual implementação usar
   Nesse caso só temos uma implementação userRepoSqlite.js
   Mas poderia ter outras como userRepoMongo.js ...
*/
module.exports = {
    findByEmail: Function,
    save: Function
  };
  