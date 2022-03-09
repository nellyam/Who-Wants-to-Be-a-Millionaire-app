let mysql = require("mysql");
let config = require("../config/config.js");

let db = {
    instance: null,
    connexion: function() {
        this.instance = mysql.createConnection({
            host     : config.DBHOST,
            user     : config.DBUSER,
            database : config.DBNAME
          });
          this.instance.connect(function(err) {
              if(err) {
                 console.log("Erreur de connexion" + err.stack);
                 return;   
              }             

          });
    },
    deconexion() {
        this.instance.end();
    }
};


   
 module.exports = db;
