import { CronJob } from 'cron';
import Debug from 'debug';
import { connect } from 'nats';

import appWorkClient from './appWorkClient';
import { cronTime, natsServer, watchMaxLimit } from './config';
import dispatch from './dispatch';
import strapiClient from './strapiClient';
import { Nats } from './types';

const debug = Debug('app');

const run = async () => {
  try {
    debug('connect to nats');
    const nc = await connect({
      servers: natsServer,
      waitOnFirstConnect: true,
      maxReconnectAttempts: -1,
    });
    debug('Nats connected');

    const remoteAppWorks = await appWorkClient.getAppWorks();
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
