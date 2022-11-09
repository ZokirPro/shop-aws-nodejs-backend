import { loggerService } from 'src/services';

export default class ImportService {
  importProductsFile(): string {
    loggerService.debug('importProductsFile service method invoked')
    return "Workingg"
  }
}