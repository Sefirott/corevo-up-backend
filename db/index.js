const db = require("mssql");

// EVYAP
/*const config = {
  user: 'sa',
  password: 'unisign@2o11',
  database: 'UnisignCorevo',
  server: 'ETZAND01',
  options: {
	  instanceName: 'UNISIGN',
	  encrypt: false, // for azure
	  trustServerCertificate: false // change to true for local dev / self-signed certs
  }
};*/

// DEV
const config = {
    server: 'localhost',
    port: 5500,
    user: 'publicuser',
    password: '347!dfm!fdm!437',
    database: 'UNISOFT2021'
};

db.connect(config, function (err) {
    if (err) console.log(err);
});

module.exports = db
