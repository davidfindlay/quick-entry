import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TimeService {

  static timeStringToSeconds(timeString) {
    let seconds;

    // Handle where user has separated with .'s instead of :
    const dotstring = timeString.split('.');
    const dotstringSections = dotstring.length;

    // Check if there is more than one .
    if (dotstringSections > 2) {

      let newTimeString = '';

      for (let i = 0; i < dotstringSections; i++) {

        newTimeString += dotstring[i];

        // Replace all but last instance of '.' with ':'
        if (i <= (dotstringSections - 3)) {

          newTimeString += ':';

        } else if (i <= (dotstringSections - 2)) {

          newTimeString += '.';

        }

      }

      timeString = newTimeString;

    }

    // Is there a colon in the time?
    if (timeString.search(':') != -1) {

      const timeArray = timeString.split(':');

      // Check how many colons are in the time
      if (timeArray.length === 2) {

        // Time in minutes and seconds
        seconds = (parseFloat(timeArray[0]) * 60) + parseFloat(timeArray[1]);

      } else if (timeArray.length === 3) {

        // Time in minutes and seconds and milliseconds
        seconds = (parseFloat(timeArray[0]) * 60) +
          (parseFloat(timeArray[1])) + parseFloat(timeArray[2]) / 100;

      }

    } else {

      // Handle times entered sequentially e.g. 132 for 1:32.00
      seconds = parseFloat(timeString);

      if (seconds > 99) {

        const strLength = timeString.length;

        // Handle 3200 as 32.00
        if (strLength <= 4) {

          seconds = parseFloat(timeString.substring(0, strLength - 2) + '.' + timeString.substring(strLength - 2));

        }

        // Handle 13200 as 1:32.00
        if (strLength <= 6 && strLength > 4) {

          seconds = (parseInt(timeString.substring(0, strLength - 4), 10) * 60) +
            parseFloat(timeString.substring(strLength - 4, strLength - 2) + '.' +
              timeString.substring(strLength - 2));

        }

        // Handle 1023200 as 1:02:32.00
        if (strLength <= 8 && strLength > 6) {

          seconds = (parseInt(timeString.substring(0, strLength - 6), 10) * 60 * 60) +
            (parseInt(timeString.substring(strLength - 6, strLength - 4), 10) * 60) +
            parseFloat(timeString.substring(strLength - 4, strLength - 2) + '.' +
              timeString.substring(strLength - 2));

        }

      } else {


      }


    }

    return seconds;
  }

  static rewriteTimeEM(timeString: string): string {

    const seconds = TimeService.timeStringToSeconds(timeString);

    let timeMin = Math.floor(seconds / 60);
    let timeHours = 0;

    if (timeMin > 60) {

      timeHours = Math.floor(timeMin / 60);
      timeMin = timeMin - (timeHours * 60);

    }

    const timeSecs = seconds % 60;
    const timeSecsStr = timeSecs.toFixed(2);
    let secString = timeSecsStr.toString();

    if (secString.length === 4) {

      secString = '0' + secString;

    }

    let nTimeString = '';

    if (timeHours > 0) {

      let minString = timeMin.toString();

      if (minString.length === 1) {

        minString = '0' + minString;

      }

      nTimeString = timeHours.toString() + ':' + minString + ':' + secString;

    } else {

      nTimeString = timeMin.toString() + ':' + secString;

    }

    if (nTimeString === 'NaN:NaN') {
      nTimeString = '0:00.00';
    }

    return nTimeString;

  }

  static formatTime(seconds: number): string {

    let nTimeString = '';
    let timeMin = Math.floor(seconds / 60);
    let timeHours = 0;

    if (timeMin > 60) {

      timeHours = Math.floor(timeMin / 60);
      timeMin = timeMin - (timeHours * 60);


    }

    const timeSecs = seconds % 60;
    let secString = timeSecs.toFixed(2);

    if (secString.length === 4) {

      secString = '0' + secString;

    }

    if (timeHours > 0) {

      let minString = timeMin.toString();

      if (minString.length === 1) {

        minString = '0' + minString;

      }

      nTimeString = timeHours.toString() + ':' + minString + ':' + secString;

    } else {

      nTimeString = timeMin.toString() + ':' + secString;

    }

    if (nTimeString === 'NaN:NaN') {
      nTimeString = '0:00.00';
    }

    return nTimeString;

  }

  constructor() {
  }

}
