var restify=require('restify');
var builder=require('botbuilder');
var http = require('http');
var cron = require('cron');

var server=restify.createServer();

server.listen(1212,function() {
    console.log("%s listening to %s",server.name,server.url);
});

var connector=new builder.ChatConnector({
    appId:'',
    appPassword:''
});

var bot=new builder.UniversalBot(connector);
server.post('/',connector.listen());
bot.dialog('/', [
    function (session) {
        session.send("main menu : ")
        session.beginDialog('/Menu', session.userData);
    }
]);



bot.dialog('/Menu', [
    function(session) {
        builder.Prompts.choice(session,"Do you want to start a Runbook : " , "YES|NO" , {listStyle: builder.ListStyle.button});       
},
function (session, results) {
        switch (results.response.index) {
            case 0:
                session.beginDialog('/YES');
                break;
            case 1:
                session.beginDialog('/NO');

                break;
                default:
                session.endDialog("end");
                break;
                        }
    }


]);


bot.dialog('/YES', [
    function (session, results) {
    	var cronJob = cron.job("0 */2 * * * *", function(){
var options = {
        host: 'localhost',
        port: 1100,
        path: '/Jobs',
        method: 'POST'
    };
    // var http = require('http');    
    http.request(options, function (res) {
        var jsondata = '';
        res.on('data', function (data) {
            jsondata += data;
        });
        res.on('end', function () {
            // response.json(JSON.parse(jsondata));
            session.send('runbook started');
        });
    }).end();
        // session.userData.name = results.response.entity;
        // session.send('runbook started');
        // getBooksData();
        // session.endConversation("Thank you!");
        }); 
        cronJob.start();
    }

]);

bot.dialog('/NO', [

    function (session, results) {
        // session.userData.name = results.response.entity;
        session.send('you select no');
        session.endConversation("if u want a help please call me!");
    }
]);
