const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const moment = require('moment');
const path = require('path');
//const iotHubClient = require('./IoThub/iot-hub.js');
//const eventHubClient = require('./IoThub/event-hub.js');
const { EventProcessorHost, delay } = require("@azure/event-processor-host");
//var  EventHubClient  = require('azure-event-hubs').Client;
const app = express();

app.use(express.static(path.join(__dirname, 'public')));
app.use(function (req, res/*, next*/) {
  res.redirect('/');
});

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Broadcast to all.
// wss.broadcast = function broadcast(data) {
//   wss.clients.forEach(function each(client) {
//     if (client.readyState === WebSocket.OPEN) {
//       try {
//         console.log('sending data ' + data);
//         client.send(data);
//       } catch (e) {
//         console.error(e);
//       }
//     }
//   });
// };

//New IotHub temp and humidity
// var iotHubReader = new iotHubClient(process.env['Azure.IoT.IoTHub.ConnectionString1'], process.env['Azure.IoT.IoTHub.ConsumerGroup1']);
// iotHubReader.startReadMessage(function (obj, date) {
//   try {
//     console.log(date);
//     date = date || Date.now()
//     wss.broadcast(JSON.stringify(Object.assign(obj, { time: moment.utc(date).format('YYYY:MM:DD[T]hh:mm:ss') })));
//   } catch (err) {
//     console.log(obj);
//     console.error(err);
//   }
// });



// EventHub
// var eventHubConnectionString = process.env['Azure.Event.EventHub.ConnectionString']  
// var eventHubName = process.env['Azure.Event.EventHub.Name'] 
// var client = EventHubClient.createFromConnectionString(eventHubConnectionString, eventHubName)

// EventHub reader for temp and humidity
// var eventHubConnectionString = process.env['Azure.Event.EventHub.ConnectionString']  
// var eventHubName = process.env['Azure.Event.EventHub.Name'] 
// //var ehClient = EventHubClient.fromConnectionString(eventHubConnectionString, eventHubName)
//  // For each partition, register a callback function
//  var eventHubReader = new eventHubClient(eventHubConnectionString, eventHubName);
//  eventHubReader.startReadMessage(function (obj, date) {
//    try {
//      console.log(date);
//      date = date || Date.now()
//      wss.broadcast(JSON.stringify(Object.assign(obj, { time: moment.utc(date).format('YYYY:MM:DD[T]hh:mm:ss') })));
//    } catch (err) {
//      console.log(obj);
//      console.error(err);
//    }
//  });

const storageContainerName = "test-container";
const eventHubName = "saoffshoreeventhub"//process.env.EVENTHUB_NAME;
const storageCS = "DefaultEndpointsProtocol=https;AccountName=saoffshoreeehstorage;AccountKey=9htrtkZv/yohMAjWi7Kxu10QVtuyH2IB/LQX6hlQxl6gyu/vMyLWi+2KbiLTRZHtHpFDIW5KToADbL5MqkfPaw==;EndpointSuffix=core.windows.net";

const ehCS = "Endpoint=sb://saoffshoreeventhub.servicebus.windows.net/;SharedAccessKeyName=SAEventHubPolicy;SharedAccessKey=aIGzSJ6iuySbv1XyK3cVsXQPl3O0SucTst7g3IEVg0E=;";

 


  // Create the Event Processo Host

  const eph = EventProcessorHost.createFromConnectionString(

    EventProcessorHost.createHostName("my-host"),

    storageCS,

    storageContainerName,

    ehCS,

    {

      eventHubPath: eventHubName

    }

  );

  let count = 0;

  // Message event handler

  const onMessage = async (context/*PartitionContext*/, data /*EventData*/) => {

   // console.log(">>>>> Rx message from '%s': '%s'", context.partitionId, data.body);

    count++;
  //  console.log(data.body);
  //  console.log("inside wss"+wss.getMaxListeners);
  
    wss.broadcast = function broadcast(data) {
      console.log("inside broadcast");

  wss.clients.forEach(function each(client) {
   // console.log("inside foreach");
    if (client.readyState === WebSocket.OPEN) {
      var obj = JSON.parse(data);
      try {
        console.log("sending data "+obj.body.CurrentPositionLat);

        //client.send(obj.body.CurrentPositionLat,obj.body.CurrentPositionLong,obj.body.EventTimestamp);
        client.send(data);
      } catch (e) {
        console.error(e);
      }
    }
  });
};
wss.broadcast(JSON.stringify(Object.assign(data)));
   // wss.broadcast(JSON.stringify(Object.assign(data.body, { time: moment.utc(Date.now).format('YYYY:MM:DD[T]hh:mm:ss') })));
    // let us checkpoint every 100th message that is received across all the partitions.
    //console.log(">>>>> CurrentPositionLat:", context.partitionId, data.body.CurrentPositionLat);
    // eventHubReader.startReadMessage(function (obj, date) {
    //   try {
    //     console.log(date);
    //     date = date || Date.now()
    //     wss.broadcast(JSON.stringify(Object.assign(obj, { time: moment.utc(date).format('YYYY:MM:DD[T]hh:mm:ss') })));
    //   } catch (err) {
    //     console.log(obj);
    //     console.error(err);
    //   }

    if (count % 100 === 0) {

      return  context.checkpoint();

    }

  };

  // Error event handler

  const onError = (error) => {

    console.log(">>>>> Received Error: %O", error);

  };

  // start the EPH

   eph.start(onMessage, onError);

  // After some time let' say 2 minutes

 




var port = normalizePort(process.env.PORT || '3000');
server.listen(port, function listening() {
  console.log('Listening on %d', server.address().port);
});

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}
