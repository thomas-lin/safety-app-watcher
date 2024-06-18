import fetch from 'cross-fetch';
import Debug from 'debug';

import { strapiAppWorkApi, dryRun } from './config';
import { Strapi } from './types';

const debug = Debug('strapiClient');
const getAppWorks = async (): Promise<Strapi.AppWork[]> => {
  const query = ['filters[$or][0][ENDTIME][$ne]=', 'filters[$or][1][ENDTIME][$notNull]=true'];
  const api = strapiAppWorkApi + `?${query.join('&')}`;
  const response = await fetch(api);
  const result = await response.json();

  return result.data;
};

const createAppWork = async (appWork: Strapi.AppWork) => {
  if (dryRun) {
    debug(`[DryRun] send ${appWork.AC_NO} to strapi, data:${JSON.stringify(appWork)}`);
    return appWork;
  }
  const res = await fetch(strapiAppWorkApi, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ data: appWork }),
  });
  const result = await res.json();
  if (result.error) {
    throw new Error(`${result.error.message}, data:${JSON.stringify(appWork)}`);
  }
  return result.data;
};

export default {
  getAppWorks,
  createAppWork,
};
