import { UAParser } from 'ua-parser-js';

export interface RegisterDeviceData {
  name: string;
  model: string;
  manufacturer: string;
  clientOrOsVersion: string;
  clientOrOsPlatform: string;
}

export const getWebClientDeviceInfo = (): RegisterDeviceData => {
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
