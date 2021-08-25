import { Component, OnInit } from '@angular/core';
import { Device } from '@ionic-native/device/ngx';
import { Platform } from '@ionic/angular';
import { LocalStorageService } from './shared/services/local-storage.service';
import { GlobalService } from './shared/services/global-service';
import { version } from './shared/constants/version';
export let projectConstants: any = {};

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
/**
 * Root class of Jaldee Application
 */
export class AppComponent implements OnInit {

  // not used
  title = 'app';

  /**
   * 
   * @param globalService 
   * @param lStorageService 
   */
  constructor(
    private device: Device,
    private platform: Platform,
    private lStorageService: LocalStorageService,
    private globalService: GlobalService

  ) { }

  /**
   * Init Method
   * if version is null or different this method clears local storage items from a list.
   * sets the current version in the local storage
   * @returns projectConstants which represents the constant variables used in jaldee UI
   * 
   */
  ngOnInit() {
    // if (this.device.uuid) {
      // console.log(this.device.uuid);
      // this.lStorageService.setitemonLocalStorage('authToken', this.device.uuid);
      this.lStorageService.setitemonLocalStorage('authToken', 'abcd'.toString());
    // }
  	let token = this.lStorageService.getitemfromLocalStorage('authToken');
    if (token) {
      let regexToReplace = /\-/gi;
      let authToken = token.replace(regexToReplace, "&");
      this.lStorageService.setitemonLocalStorage('authToken', authToken);
    }
    this.platform.ready().then(() => {
      // Okay, so the platform is ready.
      // Here you can do any higher level native things you might need.
      console.log('here');
      console.log('Device UUID is: ' + this.device.manufacturer);

      // this.firebaseX.grantPermission().then(hasPermission => {
      //   console.log("Permission was " + (hasPermission ? "granted" : "denied"));
      // });
      // this.firebaseX.getToken()
      //   .then(token => {
      //     this.lStorageService.setitemonLocalStorage('mUniqueId', token);
      //     console.log(`The token is ${token}`);
      //   }) // save the token server-side and use it to push notifications to this device
      //   .catch(error => console.error('Error getting token', error));

      // this.firebaseX.onMessageReceived().subscribe(message => {
      //   console.log(message);
      //   if (message.tap) {
      //     // const dialogrefd = this.dialog.open(NotificationDialogComponent, {
      //     //   width: '50%',
      //     //   panelClass: ['commonpopupmainclass', 'confirmationmainclass'],
      //     //   disableClose: true,
      //     //   data: {
      //     //     'message': message.body,
      //     //     'title': "Jaldee for Business",
      //     //     'btnOkTitle': 'OK'
      //     //   }
      //     // });
      //     // dialogrefd.afterClosed().subscribe(result => {
      //     //   console.log(result);
      //     // });
      //   }
      // });

      // this.firebaseX.onTokenRefresh()
      //   .subscribe((token: string) => {
      //     this.lStorageService.setitemonLocalStorage('mUniqueId', token);
      //     console.log(`Got a new token ${token}`);
      //   });
      });
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
