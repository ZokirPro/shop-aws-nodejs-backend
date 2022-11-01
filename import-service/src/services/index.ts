import ImportService from "./import-service";
import { Logger } from "./logger-service";

const loggerService = new Logger();
const importService = new ImportService()
export { loggerService, importService }