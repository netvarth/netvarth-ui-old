import { Component, OnInit } from '@angular/core';
import { GlobalService } from './shared/services/global-service';
import {version} from './shared/constants/version';
import { LocalStorageService } from './shared/services/local-storage.service';
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
    private lStorageService: LocalStorageService
  ) { }

  ngOnInit() {
    projectConstants = this.globalService.getGlobalConstants();
    const cVersion = version.desktop;
    const pVersion = this.lStorageService.getitemfromLocalStorage('version');
    if (pVersion && pVersion !== cVersion) {
      this.lStorageService.clearLocalstorage();
      this.lStorageService.setitemonLocalStorage('version', cVersion);
    } else {
      this.lStorageService.setitemonLocalStorage('version', cVersion);
    }
  }
}

