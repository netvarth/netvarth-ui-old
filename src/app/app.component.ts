import { Component, OnInit, AfterContentInit, AfterViewChecked } from '@angular/core';
import { JaldeeSseService } from './shared/services/jaldee-sse-service';
import { base_url } from './shared/constants/urls';
import { SharedFunctions } from './shared/functions/shared-functions';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
  public isShowingRouteLoadIndicator: boolean;
  title = 'app';
  constructor(private jadeeSseService: JaldeeSseService,
    private shared_functions: SharedFunctions) { }

  ngOnInit() {
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
