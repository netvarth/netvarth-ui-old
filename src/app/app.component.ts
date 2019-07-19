import { Component, HostListener } from '@angular/core';
import { Router, RouterEvent, RouteConfigLoadStart, RouteConfigLoadEnd } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  public isShowingRouteLoadIndicator: boolean;
  title = 'app';
  constructor(router: Router) {
    this.isShowingRouteLoadIndicator = false;
    var asyncLoadCount = 0;
    router.events.subscribe(
      (event: RouterEvent): void => {
        if (event instanceof RouteConfigLoadStart) {
          asyncLoadCount++;
        } else if (event instanceof RouteConfigLoadEnd) {
          asyncLoadCount--;
        }
        this.isShowingRouteLoadIndicator = !!asyncLoadCount;
      }
    );
  }
  // @HostListener('window:message', ['$event'])
  // onMessage(e) {
  //   alert(e.origin);
  //   if (e.origin !== 'http://localhost:8181' || e.origin !== 'https://sascale.jaldee.com' ||  e.origin !== 'https://sa.jaldee.com' || e.origin !== 'https://test.jaldee.com') {
  //     return false;
  //   }
  //   const response = JSON.stringify(e.data.response);
  //   delete e.data.userdata['password'];
  //   const userdata = JSON.stringify(e.data.userdata);
  //   localStorage.setItem('isBusinessOwner', 'true');
  //   localStorage.setItem('ynw-user', response);
  //   localStorage.setItem('ynw-credentials', userdata);
  //   localStorage.setItem('jld', JSON.parse(userdata)['password']);
  // }
}
