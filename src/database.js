var mysql = require('mysql');

class Request
{
    constructor(name)
    {
        this.name = name;
        this.id = null;
    }

}

class Driver
{
    constructor()
    {
        this.con = mysql.createConnection({
            host: "localhost",
            user: "root",
            database: "local_database",
            password: "password"
          });
          
          this.con.connect(function(err) {
            if (err) throw err;
            console.log("Connected!");
          });
    }

    storeRequest(req)
    {
        var sql = "insert into clients(name,address) values ('" + req.name + "','" + req.address +"');";
        this.con.query(sql, function (err, result) 
        {
            if (err) throw err;
            if (result)
            {
                req.id =result.insertId;
                console.log(req.name + "-" + req.id); 
                this.con.end();
            }           
          });
    }

}

var driver = new Driver();
driver.storeRequest(new Request("My requesttt"));
module.exports = driver;