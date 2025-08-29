const APP_TAG = "[KnR Attendance]";

type LogLevel = "debug" | "info" | "warn" | "error";

function log(level: LogLevel, message: string, ...optionalParams: any[]) {
  const prefix = `${APP_TAG} [${level.toUpperCase()}]`;

  switch (level) {
    case "debug":
      console.debug(prefix, message, ...optionalParams);
      break;
    case "info":
      console.info(prefix, message, ...optionalParams);
      break;
    case "warn":
      console.warn(prefix, message, ...optionalParams);
      break;
    case "error":
      console.error(prefix, message, ...optionalParams);
      break;
  }
}

export const Logger = {
  debug: (msg: string, ...params: any[]) => log("debug", msg, ...params),
  info: (msg: string, ...params: any[]) => log("info", msg, ...params),
  warn: (msg: string, ...params: any[]) => log("warn", msg, ...params),
  error: (msg: string, ...params: any[]) => log("error", msg, ...params),
};
