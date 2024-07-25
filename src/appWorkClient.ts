import fetch from 'cross-fetch';
import Debug from 'debug';
import { parseFromString } from 'dom-parser';
import fs from 'fs/promises';
import path from 'path';

import { appWorkAPI, appKeyUrl } from './config';

const debug = Debug('appWorkClient');

const filter = (data: any) => {
  return data
    .filter((data: any) => data.CMODE === '0' || data.CMODE === '4' || data.CMODE === '5')
    .filter((data: any) => data.VIDEOURL !== '');
};
const getAppWorks = async () => {
  // for test
  if (false) {
    const mockData = await fs.readFile(path.join(__dirname, '../seeds/data.json'), 'utf-8');
    return filter(JSON.parse(mockData));
  }

  const appKey = await getAppKey();
  if (!appKey) {
    throw new Error('no appKey');
  }
  const api = appWorkAPI.replace('{appKey}', appKey!);
  const response = await fetch(api);
  const result = await response.json();
  if (result.error) {
    throw new Error(result.error);
  }

  const data = filter(result);
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
};
