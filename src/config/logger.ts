import winston from "winston";
import config from "config";

const logger = winston.createLogger({
  level: "info",
  defaultMeta: {
    serviceName: config.get("kafka.clientId"),
  },
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json(),
  ),
  transports: [
    new winston.transports.File({
      dirname: "logs",
      filename: "combined.log",
      level: "info",
      silent: process.env.NODE_ENV === "test",
    }),
    new winston.transports.File({
      dirname: "logs",
      filename: "error.log",
      level: "error",
      silent: process.env.NODE_ENV === "test",
    }),
    new winston.transports.Console({
      level: "info",
      silent: process.env.NODE_ENV === "test",
    }),
  ],
});

export default logger;
