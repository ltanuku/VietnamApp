import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { CalendarDateFormatter, DateFormatterParams } from 'angular-calendar';

/*
  Generated class for the CustomDateFormatterProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class CustomDateFormatterProvider extends CalendarDateFormatter {
  
  public monthViewColumnHeader({ date, locale }: DateFormatterParams): string {
    return new Intl.DateTimeFormat(locale, { weekday: 'short' }).format(date);
  }
  
  public yearViewTitle({ date, locale }: DateFormatterParams): string {
    return new Intl.DateTimeFormat(locale, { year: 'numeric' }).format(date);
  }
  
  public monthViewTitle({ date, locale }: DateFormatterParams): string {
    return new Intl.DateTimeFormat(locale, { month: 'long' }).format(date);
  }

}
