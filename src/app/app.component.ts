import { Component, OnInit } from '@angular/core';
import { GlobalService } from './shared/services/global-service';
import {version} from './shared/constants/version';
import { SharedFunctions } from './shared/functions/shared-functions';
export let projectConstants: any = {};
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'app';
  constructor(
    private globalService: GlobalService,
    private shared_functions: SharedFunctions
  ) { }

  ngOnInit() {
    projectConstants = this.globalService.getGlobalConstants();
    const cVersion = version.desktop;
    const pVersion = this.shared_functions.getitemfromLocalStorage('version');
    if (!pVersion || pVersion !== cVersion) {
      this.shared_functions.clearLocalstorage();
      this.shared_functions.setitemonLocalStorage('version', cVersion);
    }
  }
}
