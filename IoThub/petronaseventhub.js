const { EventProcessorHost, delay } = require("@azure/event-processor-host");



const storageContainerName = "test-container";

const path = "saoffshoreeventhub"//process.env.EVENTHUB_NAME;

const storageCS = "DefaultEndpointsProtocol=https;AccountName=saoffshoreeehstorage;AccountKey=9htrtkZv/yohMAjWi7Kxu10QVtuyH2IB/LQX6hlQxl6gyu/vMyLWi+2KbiLTRZHtHpFDIW5KToADbL5MqkfPaw==;EndpointSuffix=core.windows.net";

const ehCS = "Endpoint=sb://saoffshoreeventhub.servicebus.windows.net/;SharedAccessKeyName=SAEventHubPolicy;SharedAccessKey=aIGzSJ6iuySbv1XyK3cVsXQPl3O0SucTst7g3IEVg0E=;";

 
async function main() {

  // Create the Event Processo Host

  const eph = EventProcessorHost.createFromConnectionString(

    EventProcessorHost.createHostName("my-host"),

    storageCS,

    storageContainerName,

    ehCS,

    {

      eventHubPath: path

    }

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

 

}

 

main().catch((err) => {

  console.log(err);

});