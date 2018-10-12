import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';
  @HostListener('window:message', ['$event'])
  onMessage(e) {
    if (e.origin != "http://localhost:8181" || e.origin != "https://sa.youneverwait.com" || e.origin != "http://35.154.241.175") {
      return false;
    }
    var response = JSON.stringify(e.data.response);
    var userdata = JSON.stringify(e.data.userdata);
    console.log("response " + response);
    console.log("userdata " + userdata);
    console.log("successs all fine");
    localStorage.setItem('isBusinessOwner', "true");
    localStorage.setItem('ynw-user', response);
    localStorage.setItem('ynw-credentials', userdata);

  }
}
