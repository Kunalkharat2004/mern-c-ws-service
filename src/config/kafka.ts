import { Consumer, EachMessagePayload, Kafka, KafkaConfig } from "kafkajs";
import config from "config";
import { MessageBroker } from "../types/broker";
import ws from "../../src/socket";

export class KafkaBroker implements MessageBroker {
  private consumer: Consumer;

  constructor(clientId: string, brokers: string[]) {

      let kafkaConfig:KafkaConfig = {
            clientId,
            brokers,
        }

        if (process.env.NODE_ENV === "production") {
            kafkaConfig = {
                ...kafkaConfig,
                ssl: true, // Enable SSL for production
                connectionTimeout: 45000, // 45 seconds
                sasl: {
                    mechanism: "plain",
                    username: config.get("kafka.sasl.username"),
                    password: config.get("kafka.sasl.password"),
                }
            }
        }
    const kafka = new Kafka(kafkaConfig);

    this.consumer = kafka.consumer({ groupId: clientId });
  }

  /**
   * Connect the consumer
   */
  async connectConsumer() {
    await this.consumer.connect();
  }

  /**
   * Disconnect the consumer
   */
  async disconnectConsumer() {
    await this.consumer.disconnect();
  }

  async consumeMessage(topics: string[], fromBeginning: boolean = false) {
    await this.consumer.subscribe({ topics, fromBeginning });

    await this.consumer.run({
      eachMessage: async ({
        topic,
        partition,
        message,
      }: EachMessagePayload) => {
        // Logic to handle incoming messages.
        console.log({
          value: message.value.toString(),
          topic,
          partition,
        });

        switch(topic){
          case "order":{
            const order = JSON.parse(message.value.toString());
            ws.io.emit("order-update",order)
            break;
          }
          default:
            console.log("Do nothing...");
        }
      },
    });
  }
}
