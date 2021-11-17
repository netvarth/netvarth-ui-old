import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class I18nService {

  localeEvent = new Subject<string>();

  constructor(private translate: TranslateService) { }

  public changeLocale(locale: string){
    const jsonData = JSON.stringify(locale);
    localStorage.setItem('myData', jsonData);
    console.log(jsonData,'testong')
     this.translate.use(locale);
    this.localeEvent.next(locale);
  }
//   public getitemfromLocalStorage(itemname) {
//         if (localStorage.getItem(itemname) !== 'undefined') {
//             return JSON.parse(localStorage.getItem(itemname));
//         }

// }

}