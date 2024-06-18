import { CronJob } from 'cron';
import Debug from 'debug';
import fs from 'fs/promises';
import { connect } from 'nats';
import path from 'path';

import appWorkClient from './appWorkClient';
import { cronTime, natsServer, watchMaxLimit } from './config';
import dispatch from './dispatch';
import strapiClient from './strapiClient';
import { Nats } from './types';

const debug = Debug('app');

const getRemoteAppWorks = async () => {
  if (false) {
    const mockData = await fs.readFile(path.join(__dirname, '../seeds/data.json'), 'utf-8');
    return JSON.parse(mockData);
  }

  const appKey = await appWorkClient.getAppKey();
  if (!appKey) {
    throw new Error('AppKey is not found');
  }
  const remoteAppWorks = await appWorkClient.getAppWorks(appKey);
  debug(`got ${remoteAppWorks.length} appWorks`);
  return remoteAppWorks;
};

const run = async () => {
  try {
    debug('connect to nats');
    const nc = await connect({
      servers: natsServer,
      waitOnFirstConnect: true,
      maxReconnectAttempts: -1,
    });
    debug('Nats connected');

    const remoteAppWorks = await getRemoteAppWorks();
    const localAppWorks = await strapiClient.getAppWorks();

    // need to create
    const createdAppWorks = remoteAppWorks
      .filter((appWork: any) =>
        localAppWorks.every((localAppWork) => localAppWork.AC_NO !== appWork.AC_NO)
      )
      .slice(0, watchMaxLimit || Infinity);
    debug(`need to create ${createdAppWorks.length} appWorks`);
    for (const appWork of createdAppWorks) {
      try {
        const result = await strapiClient.createAppWork(appWork);
        dispatch(Nats.Event.APP_START, result, nc);
      } catch (error) {
        debug(error);
      }
    }
  } catch (error) {
    debug(error);
  }
};

const job = new CronJob({
  cronTime,
  onTick: run,
  runOnInit: process.env.NODE_ENV === 'development',
});

if (process.env.NODE_ENV === 'production') {
  job.start();
}
