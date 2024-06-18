import { Moment } from 'moment-timezone';

export namespace Strapi {
  export type CMode = '0' | '4' | '5';

  export type AppWork = {
    id?: number;
    AC_NO: string;
    CMODE: CMode;
    TC_NA: string;
    AP_NAME: string;
    DIGADD: string;
    PURP: string;
    VIDEOURL: string;
    VIDEONO: number;
    LAT: number;
    LON: number;
    APPTIME: Moment;
    ENDTIME: Moment;
  };
}

export namespace Nats {
  export enum Event {
    APP_START = 'app.start',
    APP_STOP = 'app.stop',
  }

  export type EventData = Pick<Strapi.AppWork, 'AC_NO' | 'VIDEOURL'>;
}
