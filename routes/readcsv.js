//const HelperCsv = require('../helper/helpercsv'); // Import User Model Schema
const Agent = require('../models/agent'); // Import User Model Schema
const jwt = require('jsonwebtoken'); // Compact, URL-safe means of representing claims to be transferred between two parties.
const config = require('../config/database'); // Import database configuration
const fs = require('fs');
const csv = require('fast-csv');
module.exports = (router) => {
        /* GET Upload a csv. */
    
    /*router.get('/upload', (req, res) => {
        var agents = [];

        res.send("upload");
        fs.createReadStream("./uploads/my.csv")
        .pipe(csv())
        .on("data", function(data){
            //console.log(data);
            agents.push('A');
            agents.push('B');
            agents.push('C');
        })
        .on("end", function(){
            console.log("finished");
        });
        console.log(agents);
        for(i = 0; i < agents.length; i++) {
                //console.log("helekamehele");
                //console.log("etrola" + agents[i] + "\n");
        }
      var agent = null;

      for(i = 0; i < 125; i++) {
            agent = new Agent ({ firstname: "Company Inc" + i, 
                            lastname: "Highway 37" + i, 
                            emailaddr: "Highway 37", 
                            mobilenumber: "Highway 37",
                            address: "Highway 37",
                            notifystatus: "f"
                            });
            
            agent.save((err) => {
            if (err) throw err;
                console.log("1 record inserted");
            });
            //console.log(agent);
      }


    });*/

    router.get('/save', (req, res) => {
        const fileName = "./client/src/assets/uploads/my.csv";
        var stream = fs.createReadStream(fileName);
        var agent = null;
        res.send("upload");
        csv
        .fromStream(stream, {ignoreEmpty: true})
        .on("data", function(data){
                console.log(data);
                agent = new Agent({
                    firstname: data[0], // FirstName field
                    lastname: data[1], // LastName field
                    emailaddr: data[2], // Email Address field
                    mobilenumber: data[3], //Mobile Number
                    address: data[4], //address Number
                    notifystatus: data[5] //address Number
                });
                // Save agent into database
                try {
                    agent.save((err) => {
                        if (err) { 
                            if (err.code === 11000) {
                                console.log(err.toString().op);
                                //res.json();
                                return err;
                            } else {
                                throw err;
                            }

                        } else { 
                            return data;
                            //res.json({ success: true, message: 'Agent saved!' });

                        }
                    });
                } catch(ex) {
                    callback(ex);
                    console.log(ex);
                }

                //agent = null;
            })
            .on("end", function(){
            console.log("done");
            });


    });


   return router;
};



