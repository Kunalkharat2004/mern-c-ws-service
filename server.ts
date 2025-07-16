import config from "config";
import logger from "./src/config/logger";
import { createMessageBroker } from "./src/factories/broker-factory";
import { MessageBroker } from "./src/types/broker";
import ws from "./src/socket";

const startServer = async () => {
  let broker: MessageBroker | null = null;
  try {
    // 1) Start HTTP + WebSocket listener immediately
    const PORT = config.get("server.port");
    ws.httpServer.listen(PORT,()=>{
      console.log(`Listening on port ${PORT}`);
    }).on("error",(err)=>{
      logger.error("Server error, ",err)
      ws.httpServer.closeAllConnections()
      process.exit(1);
    })
    
    // 2) Connect Kafka consumer in “background”
    broker = createMessageBroker();
    await broker.connectConsumer();
    await broker.consumeMessage(config.get("kafka.topics"), false);
    logger.info("Kafka connected successfully.");

  } catch (err) {
    logger.error("Error happened: ", err);
    if(broker){
      await broker.disconnectConsumer();
    }
    process.exit(1);
  }
};

void startServer();
