const db = require("mssql");

const config = {
  user: 'sa',
  password: 'unisign@2o11',
  database: 'UnisignCorevo',
  server: 'ETZAND01',
  options: {
	  instanceName: 'UNISIGN',
	  encrypt: false, // for azure
	  trustServerCertificate: false // change to true for local dev / self-signed certs
  }
};

db.connect(config, function (err) {
    if (err) console.log(err);
});

module.exports = db
