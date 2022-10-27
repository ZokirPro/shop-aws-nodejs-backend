import { LogLevels } from 'src/constants';
import { format, createLogger, transports, Logger as WinstonLogger } from 'winston';

export class Logger {
  private _logger: WinstonLogger;

  public constructor() {
    this._logger = createLogger({
      level: LogLevels.Debug,
      format: this.getFormat(),
      transports: [
        new transports.Console({
          format: this.getFormat(),
        }),
      ],
    });
  }

  private getFormat() {
    const formats = [format.json(), format.errors({ stack: true }), format.timestamp()];
    formats.push(format.prettyPrint());
    return format.combine(...formats);
  }

  private log(level: LogLevels, message: string, data: unknown[] = []): void {
    this._logger.log(level, message, data);
  }
  public debug(message: string, meta?: unknown[]): void {
    this.log(LogLevels.Debug, message, meta);
  }

  public error(message: string, meta?: unknown[]): void {
    this.log(LogLevels.Error, message, meta);
  }

}