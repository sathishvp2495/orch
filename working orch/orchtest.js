var express = require('express');
var app = express();
var request = require('request');
var httpntlm = require('httpntlm');
var async = require('async');
var config = require("./index.js");


var pathrest = config.path;
console.log("length:::::++"+pathrest.length);

var runbookData = config.runbookData;
console.log("runbookData of::::::::::::::::::::::::::::::::"+runbookData[0]);

pathrest.forEach(function(value){
    console.log(value);
      var str;

// app.get('/searching' , function (req, res, next) {
app.post(value ,function (req, res, next) {

	// var str = '{ "RunbookId": "4d42cb5b-47ae-451e-8b45-7947c0168d31","Parameters": "<Data><Parameter><ID>{f492ae11-fc2f-4b85-b1d3-aa588bdc63fb}</ID><Value>dec-10-2017</Value></Parameter></Data>" }';
      var i;
    for (i=0;i<=(pathrest.length-1);i++) {
            if(req.path == pathrest[i])
            {
            str = runbookData[i]
            console.log("path of data:::::::::::"+str);
            }
    }

    var obj = JSON.parse(str);
    console.log("str:::::::"+str);

    console.log("callled 123")

    httpntlm.post({
        url: "http://sp2:81/Orchestrator2012/Orchestrator.svc/Jobs",
        username: "adminuser",
        password: "Thiral987",
        workstation: '',
        domain: 'Thiral.com',
        json: obj
            }, function (err, ntlmRes) {
     
        console.log("callled function");
        console.log("body::::"+ntlmRes.body);
        console.log("error::::"+err);
     
        // Also handle the error call
        if (err) {
            console.log("error::::"+err)
            return res.status(500).send("Problem with request call" + err.message);
        }
        console.log("status code::::::"+ntlmRes.statusCode)
        res.status(ntlmRes.statusCode) // Status code first
           // res.send(ntmlRes.statusCode);        // Body data
           res.end(ntlmRes.body);
    });
});
});

// dd25f574-aa64-44f6-b073-943a94a88c15

app.listen(1100);
console.log("listen port 1100");