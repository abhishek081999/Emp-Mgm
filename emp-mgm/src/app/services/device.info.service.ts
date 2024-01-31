import { Injectable } from '@angular/core';
@Injectable({
  providedIn: 'root'
})
export class DeviceInfoService {

  getDeviceInfo() {
    const userAgent = navigator.userAgent;
    let device = 'Unknown device';
    let browser = 'Unknown browser';
    let browserVersion = 'Unknown version';

    // Check for device
    if (/iPhone|iPad|iPod/i.test(userAgent)) {
      device = 'iOS';
    } else if (/Android/i.test(userAgent)) {
      device = 'Android';
    }
    else if (/Windows/i.test(userAgent)) {
      device = 'Windows';
    }
    else if (/webOS/i.test(userAgent)) {
      device = 'webOS';
    }
    else if (/Windows Phone/i.test(userAgent)) {
      device = 'Windows Phone';
    }
    else if (/Macintosh/i.test(userAgent)) {
      device = 'Macintosh';
    }
    else if (/Windows NT|Touch/i.test(userAgent)) {
      device = 'Windows Touch';
    }

    // Check for browser
    if (/Chrome/i.test(userAgent)) {
      browser = 'Chrome';
      browserVersion = userAgent.split('Chrome/')[1].split(' ')[0];
    } else if (/Firefox/i.test(userAgent)) {
      browser = 'Firefox';
      browserVersion = userAgent.split('Firefox/')[1].split(' ')[0];
    } else if (/Safari/i.test(userAgent)) {
      browser = 'Safari';
      browserVersion = userAgent.split('Version/')[1].split(' ')[0];
    }
    else if (/Edg/i.test(userAgent)) {
      browser = 'edge';
      browserVersion = userAgent.split('Version/')[1].split(' ')[0];
    }
    return { Device: device, Browser: `${browser} ${browserVersion}` };
  }
}

