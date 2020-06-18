import { Component, OnInit, AfterContentInit, AfterViewChecked, AfterViewInit } from '@angular/core';
import { JaldeeSseService } from './shared/services/jaldee-sse-service';
import { SharedServices } from './shared/services/shared-services';
import { GlobalService } from './shared/services/global-service';
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
    private globalService: GlobalService) { }

  ngOnInit() {
    projectConstants = this.globalService.getGlobalConstants();
    // GOOGLEAPIKEY
    // this.shared_services.getS3Url().then(
    //   (s3Url: any) => {
    //     console.log(s3Url);
    //     this.shared_services.getUIConfig(s3Url).subscribe(
    //       (config: any) => {
    //         // console.log(config);
    //         projectConstantsGlobal = config;
    //         console.log(projectConstantsGlobal);
    //         this.isShowingRouteLoadIndicator = true;
    //       },
    //       (error) => {
    //         console.log(error);
    //       }

    //     );
    //   }
    // );
    // const isProvider = this.shared_functions.getitemfromLocalStorage('isBusinessOwner');
    // const user = this.shared_functions.getitemfromLocalStorage('ynw-credentials');
    // if (isProvider === 'true' && user) {
    //   this.jadeeSseService.getServerSentEvent(base_url + 'provider/events').subscribe(
    //     data => {
    //       console.log(data);
    //     }
    //   );
    // } else {
    //   this.jadeeSseService.getServerSentEvent(base_url + 'consumer/events').subscribe(
    //     data => {
    //       console.log(data);
    //     }
    //   );
    // }
  }
}
