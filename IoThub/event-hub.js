
// 'use strict';

// //var { EventHubClient, EventPosition } = require('azure-event-hubs');
// const { EventProcessorHost, delay } = require("@azure/event-processor-host");

// // // Close connection to Event Hub.
// // EventHubReaderClient.prototype.stopReadMessage = function() {
// //   this.eventHubClient.close();
// // }

// // // Read device-to-cloud messages from Event Hub.
// // // Read device-to-cloud messages from IoT Hub.
// // EventHubReaderClient.prototype.startReadMessage = function(cb) {
// //   var self = this;
// //   var printError = function(err) {
// //     console.error(err.message || err);
// //   };
//   //var deviceId = process.env['Azure.IoT.IoTHub.DeviceId'];

// //   EventHubClient.createFromIotHubConnectionString('Endpoint=sb://petronas.servicebus.windows.net/;SharedAccessKeyName=EHowner;SharedAccessKey=oB/xngSCnNL0E44Q35fndVKJ9Mndu9/2VJSiAsRrkB4=;EntityPath=eventhub1').then((client) => {
// //     console.log("Successully created the EventHub Client from iothub connection string.");
// //     self.eventHubClient = client;
// //     return self.eventHubClient.getPartitionIds();
// //   }).then((ids) => {
// //     console.log("The partition ids are: ", ids);
// //     var onMessageHandler = (message) => {
// //       // var from = message.annotations['iothub-connection-device-id'];
// //       // if (deviceId && deviceId !== from) {
// //       //   return;
// //       // }
// //       cb(message.body, Date.parse(message.enqueuedTimeUtc));
// //     };
// //     return ids.map(function (id) {
// //       return self.eventHubClient.receive(id, onMessageHandler, printError, { eventPosition: EventPosition.fromEnqueuedTime(Date.now()) });
// //     });
// //   }).catch(printError);

// // }


// const storageContainerName = "test-container";

// const eventHubName = "saoffshoreeventhub"//process.env.EVENTHUB_NAME;

// const storageCS = "DefaultEndpointsProtocol=https;AccountName=saoffshoreeehstorage;AccountKey=9htrtkZv/yohMAjWi7Kxu10QVtuyH2IB/LQX6hlQxl6gyu/vMyLWi+2KbiLTRZHtHpFDIW5KToADbL5MqkfPaw==;EndpointSuffix=core.windows.net";

// const ehCS = "Endpoint=sb://saoffshoreeventhub.servicebus.windows.net/;SharedAccessKeyName=SAEventHubPolicy;SharedAccessKey=aIGzSJ6iuySbv1XyK3cVsXQPl3O0SucTst7g3IEVg0E=;";

// async function main() {

//   // Create the Event Processo Host

//   const eph = EventProcessorHost.createFromConnectionString(

//     EventProcessorHost.createHostName("my-host"),

//     storageCS,

//     storageContainerName,

//     ehCS,

//     {

//       eventHubPath: eventHubName

//     }//,

//     //onEphError(error) => {

//     //  console.log("This handler will notify you of any internal errors that happen " +

//     //  "during partition and lease management: %O", error);

//    // }

//   );

//   let count = 0;

//   // Message event handler

//   const onMessage = async (context/*PartitionContext*/, data /*EventData*/) => {

//     console.log(">>>>> Rx message from '%s': '%s'", context.partitionId, data.body);

//     count++;

//     // let us checkpoint every 100th message that is received across all the partitions.

//     if (count % 100 === 0) {

//       return await context.checkpoint();

//     }

//   };

//   // Error event handler

//   const onError = (error) => {

//     console.log(">>>>> Received Error: %O", error);

//   };

//   // start the EPH

//   await eph.start(onMessage, onError);

  

// }


// // function EventHubReaderClient(connectionString, eventHubName) {
// //   this.connectionString = connectionString;
// //   this.eventHubClient = undefined;
// //   this.eventHubName = eventHubName; 
// // }

// // module.exports = EventHubReaderClient;
