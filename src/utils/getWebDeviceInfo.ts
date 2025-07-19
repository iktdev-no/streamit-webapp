import { UAParser } from 'ua-parser-js';
import type { RequestDeviceInfo } from '../types/notification';



export const getWebClientDeviceInfo = (): RequestDeviceInfo => {
  const result = UAParser(); // safe over HTTP

  const browserName = result.browser.name ?? 'Web Browser';
  const browserVersion = result.browser.version ?? '';
  const name = browserVersion ? `${browserName} ${browserVersion}` : browserName;

  const osPlatform = result.os.name ?? navigator.platform ?? 'Web';
  const osVersion = result.os.version ?? 'latest';

  const model = result.device.model ?? (
    osPlatform.includes('Android') ? 'Android Device' :
    osPlatform.includes('iPhone') ? 'iPhone' :
    osPlatform.includes('Mac') ? 'Mac Device' :
    'Web Device'
  );

  const manufacturerMap: Record<string, string> = {
    Firefox: 'Mozilla Foundation',
    Chrome: 'Google LLC',
    Safari: 'Apple Inc.',
    Edge: 'Microsoft Corporation',
    Opera: 'Opera Software',
  };
  const manufacturer = manufacturerMap[browserName] ?? browserName ?? 'Web';

  return {
    name,
    model,
    manufacturer,
    clientOrOsVersion: osVersion,
    clientOrOsPlatform: osPlatform,
  };
};
