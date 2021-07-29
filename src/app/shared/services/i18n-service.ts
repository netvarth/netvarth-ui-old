import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class I18nService {

  localeEvent = new Subject<string>();

  constructor(private translate: TranslateService) { }

  changeLocale(locale: string){
    const jsonData = JSON.stringify(locale);
    localStorage.setItem('myData', jsonData)
    this.translate.use(locale);
    this.localeEvent.next(locale);
  }

}