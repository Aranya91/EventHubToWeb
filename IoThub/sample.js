const { EventProcessorHost, delay } = require("@azure/event-processor-host");

 

//const path = process.env.EVENTHUB_NAME;

//const storageCS = process.env.STORAGE_CONNECTION_STRING;

//const ehCS = process.env.EVENTHUB_CONNECTION_STRING;

const storageContainerName = "test-container";

const path = "eventhub1"//process.env.EVENTHUB_NAME;

const storageCS = "DefaultEndpointsProtocol=https;AccountName=petronas;AccountKey=IVZ+dF01nNoghYCVYdoYn0FxW2A9WT6++ZE4fsI1tpPTiuat6vGoZOQIZLY8gp9yprtdMO0WSQP1tmsIa4FY2w==;EndpointSuffix=core.windows.net";

const ehCS = "Endpoint=sb://petronas.servicebus.windows.net/;SharedAccessKeyName=EHowner;SharedAccessKey=oB/xngSCnNL0E44Q35fndVKJ9Mndu9/2VJSiAsRrkB4=;";

 

async function main() {

  // Create the Event Processo Host

  const eph = EventProcessorHost.createFromConnectionString(

    EventProcessorHost.createHostName("my-host"),

    storageCS,

    storageContainerName,

    ehCS,

    {

      eventHubPath: path

    }//,

    //onEphError(error) => {

    //  console.log("This handler will notify you of any internal errors that happen " +

    //  "during partition and lease management: %O", error);

   // }

  );

  let count = 0;

  // Message event handler

  const onMessage = async (context/*PartitionContext*/, data /*EventData*/) => {

    console.log(">>>>> Rx message from '%s': '%s'", context.partitionId, data.body);

    count++;

    // let us checkpoint every 100th message that is received across all the partitions.

    if (count % 100 === 0) {

      return await context.checkpoint();

    }

  };

  // Error event handler

  const onError = (error) => {

    console.log(">>>>> Received Error: %O", error);

  };

  // start the EPH

  await eph.start(onMessage, onError);

  // After some time let' say 2 minutes

  await delay(120000);

  // This will stop the EPH.

  await eph.stop();

}

 

main().catch((err) => {

  console.log(err);

});