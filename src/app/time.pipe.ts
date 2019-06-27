import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'time'
})
export class TimePipe implements PipeTransform {

  transform(value: number, args?: any): string {

    if (value === 0) {
      return 'NT';
    }

    let remainder = 0;
    const hours: number = Math.floor(value / 3600);
    remainder = value % 3600;
    const minutes: number = Math.floor(remainder / 60);
    const seconds = (remainder % 60);

    let formattedTime = '';

    if (seconds >= 3600) {
      if (hours > 0) {
        formattedTime = hours + ':';
      }
    }

    if (minutes > 0) {
      formattedTime = formattedTime + minutes + ':';
    }

    if (seconds < 10 && minutes > 0) {
      formattedTime = formattedTime + '0' + seconds.toFixed(2);
    } else {
      formattedTime = formattedTime + seconds.toFixed(2);
    }


    return formattedTime;
  }

}
