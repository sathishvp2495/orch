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


var restapi = ['filetextedit','editor','restcall']




var bot=new builder.UniversalBot(connector);
server.post('/',connector.listen());


bot.dialog('/',[
    function(session) {
        session.beginDialog('/Menu');

    }

]);


    bot.dialog('/Menu', [
    function(session) {
        builder.Prompts.choice(session,"your runbooks are: " , "filetextedit | editor | restcall " , {listStyle: builder.ListStyle.button});
},
   function (session, results) {
        switch (results.response.index) {
            case 0:
                session.beginDialog('filetextedit');
                break;
            case 1:
                session.beginDialog('editor');
                break;
            case 2:
                session.beginDialog('restcall');
                break;        

            default:
                session.endDialog("end");
                break;
        }
    }
    ])

    var str;
    restapi.forEach(function(value){

bot.dialog(value, [
        function(session) {

            var i;
            for (i=0;i<=(restapi.length-1);i++) {
            if(value == restapi[i])
            {
            str = restapi[i]
            }
        }
        builder.Prompts.text(session,"Do you want to start a Runbook now or later");       
    },
    
        function (session, results) {
        session.userData.time = results.response;

        if(session.userData.time=='now'){
           session.beginDialog('/now');
        }
        else if(session.userData.time=='later'){
        session.beginDialog('/later');
        };
        }
    ])
});

bot.dialog('/later', [
        function(session) {
         builder.Prompts.number(session,"Enter a minutes in numeric");       
    },
        function (session, results) {
        session.userData.minutes = results.response;
        builder.Prompts.number(session, "Enter a hour in numeric"); 
    },
        function (session, results) {
        session.userData.hour = results.response;
        var cronJob = cron.job("00 "+session.userData.minutes+" "+session.userData.hour+" * * *", function(){
        
        var options = {
        host: 'localhost',
        port: 1100,
        path: '/'+str,
        method: 'POST'
    };    
    
    http.request(options, function (res) {
        var jsondata = '';
        res.on('data', function (data) {
            jsondata += data;
        });
        res.on('end', function () {

            session.send(str +' runbook started');
            session.endConversation("Thank you!");
            // session.reset();
            session.clearDialogStack()

        });
    }).end();
        });
        cronJob.start();
        if(session.userData.minutes!=null){
            session.beginDialog('/Menu');
        }
    }
]);


bot.dialog('/now', [
    function (session, results) {
var options = {
        host: 'localhost',
        port: 1100,
        path: '/'+str,
        method: 'POST'
    };    
    http.request(options, function (res) {
        var jsondata = '';
        res.on('data', function (data) {
            jsondata += data;
        });
        res.on('end', function () {
            session.send(str +' runbook started');
            session.endConversation("Thank you!");
            // session.reset();
            session.clearDialogStack()

        });
    }).end();
    }
]);
