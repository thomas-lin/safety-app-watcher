import 'dotenv/config';

export const dryRun = process.env.DRY_RUN === 'true';
export const cronTime = process.env.CRON_TIME || '*/5 9-18 * * *';
export const watchMaxLimit = process.env.WATCH_MAX_LIMIT
  ? Number(process.env.WATCH_MAX_LIMIT)
  : undefined;
export const natsServer = process.env.NATS_SERVER || 'nats://localhost:4222';
export const strapiAppWorkApi =
  process.env.STRAPI_APP_WORK_API || 'http://localhost:1337/api/app-works';

export const appKeyUrl = process.env.APP_KEY_URL || 'https://dig.taipei/Tpdig/Map/ShowPublic.aspx';
export const appWorkAPI =
  process.env.APP_WORK_API ||
  'https://dig.taipei/Tpdig/APP/GetAppWork.ashx?userid=tpdig&key=89181e5d20500eb78b89161ff97df2fa&isrpic=1';
