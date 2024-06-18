import fetch from 'cross-fetch';
import Debug from 'debug';
import { parseFromString } from 'dom-parser';

import { appWorkAPI, appKeyUrl } from './config';

const debug = Debug('appWorkClient');
const getAppWorks = async (appKey: string) => {
  const api = appWorkAPI.replace('{appKey}', appKey);
  const response = await fetch(api);
  const result = await response.json();
  if (result.error) {
    throw new Error(result.error);
  }

  const data = result
    .filter((data: any) => data.CMODE === '0' || data.CMODE === '4' || data.CMODE === '5')
    .filter((data: any) => data.VIDEOURL !== '');
  debug(`getAppWorks size: ${result.length} -> ${data.length}`);
  return data;
};

const getAppKey = async (): Promise<string | undefined> => {
  const response = await fetch(appKeyUrl);

  if (response.status !== 200) {
    throw new Error(response.statusText);
  }

  const html = await response.text();
  const dom = parseFromString(html);
  const appKey = dom.getElementById('AppKey')?.getAttribute('value');
  return appKey;
};

export default {
  getAppWorks,
  getAppKey,
};
