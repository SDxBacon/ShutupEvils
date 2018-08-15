var PORT = 25252;
var BROADCAST_ADDR = "192.168.11.255";
var dgram = require('dgram'); 
var server = dgram.createSocket("udp4"); 

var test_msg = {id : "evils_show_yourself"};

server.bind(function() {
    server.setBroadcast(true);
    setInterval(ProbingEvils, 3000);
});

server.on('message', function(bufMsg, rinfo) {
    var message = JSON.parse(bufMsg.toString());
    switch ( message.id ) {
        case "evilInfo":
            console.log(`evil respond: ${bufMsg.toString()}`);
        default:
            break;
    }
});


function ProbingEvils() {
    var message = Buffer.from( JSON.stringify(test_msg) );
    server.send( message, 0, message.length, PORT, BROADCAST_ADDR, function() {
        console.log("Probing evils beacon has been sent.")
    });
}