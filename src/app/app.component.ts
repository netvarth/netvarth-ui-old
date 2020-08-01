import { Component, OnInit, AfterContentInit, AfterViewChecked, AfterViewInit } from '@angular/core';
import { JaldeeSseService } from './shared/services/jaldee-sse-service';
import { SharedServices } from './shared/services/shared-services';
import { GlobalService } from './shared/services/global-service';
import { ProviderDataStorageService } from './ynw_provider/services/provider-datastorage.service';
export let projectConstants: any = {};
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'app';
  constructor(private jadeeSseService: JaldeeSseService,
    private shared_services: SharedServices,
    private globalService: GlobalService
  
  ) { }

  ngOnInit() {
    projectConstants = this.globalService.getGlobalConstants();
  }
}
