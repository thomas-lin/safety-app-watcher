import Debug from 'debug';
import { JSONCodec, NatsConnection } from 'nats';

import { dryRun } from './config';
import { Strapi, Nats } from './types';

const debug = Debug('dispatch');

const emit = async (event: Nats.Event, appWork: Strapi.AppWork, nc: NatsConnection) => {
  const subject = `${event}.${appWork.AC_NO}`;
  const eventData: Nats.EventData = { AC_NO: appWork.AC_NO, VIDEOURL: appWork.VIDEOURL };
  if (dryRun) {
    debug(`[DryRun] send ${subject} to nats, data:${JSON.stringify(eventData)}`);
    return;
  }
  debug(`send ${subject} to nats`);
  const jc = JSONCodec();
  nc.publish(subject, jc.encode(eventData));
};

export default emit;
