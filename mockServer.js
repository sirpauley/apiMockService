/****************************************
 * 
 * setting up vars with default values
 * 
 ******************************************/

var portNumber = 8000;
var responseFileName = "response.json"

/****************************************
 * 
 * Read the config
 * 
 ******************************************/
const fs = require('fs');

let configRawdata = fs.readFileSync('config.json');
var configData = JSON.parse(configRawdata);
const configEntries = Object.entries(configData);

for (const [key, value] of configEntries) {
    // console.log(`THe key "${key}" has value of "${value}"`);
    if (key == "portNumber") {//just a test
        portNumber = value;
    }
}

portNumber = configData.portNumber;
responseFileName = configData.responseFile;

// console.log("port number should be", configData.portNumber);

/****************************************
 * 
 * Read the responses
 * 
 ******************************************/
try {
    let responsesRawdata = fs.readFileSync(responseFileName);
    var responsesData = JSON.parse(responsesRawdata);
    const services = Object.entries(responsesData);

} catch (e) {
    console.log("[ERROR] - file not found:", responseFileName);
    console.log("[ERROR] - Closing program");
    process.exit(22);
}


/****************************************
 * 
 * Start the server
 * 
******************************************/

var http = require('http');
var qs = require("querystring");

http.createServer(function (requests, response) {
    response.setHeader('Content-Type', 'application/json');

    console.log("******************************************");
    console.log("[INFO] - START");

    // console.log(requests);
    var body = '';
    var requestMethod = requests.method;

    // console.log("requestMethod:", requestMethod);

    requests.on('data', chunk => {
        body += chunk.toString();//convert buffer to string
        body = JSON.parse(body)
        // console.log("Partial body:", body);
    });

    requests.on("end", function () {

        var requestUrl = requests.url.substring(1);

        // console.log("Request object:", requestUrl);
        var objectArray;

        var requestUrlMap = requestUrl.split("/");
        requestUrlMap.unshift(requestMethod);
        // console.log("body", body);
        if (body) {
            const bodyItems = Object.entries(body);
            for (const [postKey, postValue] of bodyItems) {
                // console.log("key:", postKey);
                // console.log("value:", postValue);
                requestUrlMap.push(postKey);
                requestUrlMap.push(postValue);
            }
        }
        // console.log("requestUrlMap:", requestUrlMap);
        // console.log("responsesData", responsesData["POST_funeral_clientName_johnny"]);
        try {

            var requestMapObjectName = requestUrlMap.join("_");
            // console.log("requestObjectName:",requestMapObjectName);

            var responsedWithRecord = responsesData[requestMapObjectName];
            if (responsedWithRecord) {
                objectArray = responsedWithRecord;
            } else {
                throw "No data found!!"
            }
            console.log("[INFO] -", "request made:", requestMapObjectName);
        } catch (e) {
            console.log("[ERROR] - ", e);
            console.log("[ERROR] - map:", requestMapObjectName);
            console.log("[ERROR] - file:", responseFileName);
            response.writeHead(500, { 'Content-Type': 'text/html' });
            response.end('<h1>an error has occured!</h1>');
        } finally {
            console.log("[INFO] - END");
        }

        //debug purpose
        // console.log(objectArray);

        response.end(JSON.stringify(objectArray));

    });

}).listen(portNumber);

console.log("[INFO]", "Server is running at:", portNumber);