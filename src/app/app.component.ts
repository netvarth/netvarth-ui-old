import { Component, OnInit } from '@angular/core';
import { GlobalService } from './shared/services/global-service';
import {version} from './shared/constants/version';
import { LocalStorageService } from './shared/services/local-storage.service';
import { SharedFunctions } from './shared/functions/shared-functions';
import { Device } from '@ionic-native/device/ngx';
import { Platform } from '@ionic/angular';
import { FirebaseX } from '@ionic-native/firebase-x/ngx';
import { MatDialog } from '@angular/material/dialog';
import { NotificationDialogComponent } from './shared/components/notification-dialog/notification-dialog.component';
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
    private globalService: GlobalService,
    private lStorageService: LocalStorageService,
    private shared_functions: SharedFunctions,
    private firebaseX: FirebaseX,
    private device: Device,
    private platform: Platform,
    private dialog: MatDialog
  ) { }

  /**
   * Init Method
   * if version is null or different this method clears local storage items from a list.
   * sets the current version in the local storage
   * @returns projectConstants which represents the constant variables used in jaldee UI
   * 
   */
  ngOnInit() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready.
      // Here you can do any higher level native things you might need.
      console.log('here');
      console.log('Device UUID is: ' + this.device.manufacturer);

      this.firebaseX.grantPermission().then(hasPermission => {
        console.log("Permission was " + (hasPermission ? "granted" : "denied"));
      });
      this.firebaseX.getToken()
        .then(token => {
          this.lStorageService.setitemonLocalStorage('mUniqueId', token);
          console.log(`The token is ${token}`);
        }) // save the token server-side and use it to push notifications to this device
        .catch(error => console.error('Error getting token', error));

      this.firebaseX.onMessageReceived().subscribe(message => {
        console.log(message);
        const dialogrefd = this.dialog.open(NotificationDialogComponent, {
          width: '50%',
          panelClass: ['commonpopupmainclass', 'confirmationmainclass'],
          disableClose: true,
          data: {
            'message': message.body,
            'title': "Jaldee for Business",
            'btnOkTitle': 'OK'
          }
        });
        dialogrefd.afterClosed().subscribe(result => {
          console.log(result);
        });
      });

      this.firebaseX.onTokenRefresh()
        .subscribe((token: string) => {
          this.lStorageService.setitemonLocalStorage('mUniqueId', token);
          console.log(`Got a new token ${token}`);
        });
      projectConstants = this.globalService.getGlobalConstants();
      const cVersion = version.desktop;
      const pVersion = this.lStorageService.getitemfromLocalStorage('version');
      if ((pVersion && pVersion !== cVersion) || !pVersion) {
        const ynw_user = this.lStorageService.getitemfromLocalStorage('ynw-credentials');
        if (ynw_user) {
          const phone_number = ynw_user.loginId;
          const password = this.lStorageService.getitemfromLocalStorage('jld');
          if (!ynw_user.mUniqueId) {
            if (this.lStorageService.getitemfromLocalStorage('mUniqueId')) {
              ynw_user.mUniqueId = this.lStorageService.getitemfromLocalStorage('mUniqueId');
              this.lStorageService.setitemonLocalStorage('ynw-credentials', ynw_user);
            }
          }
          const post_data = {
            'countryCode': '+91',
            'loginId': phone_number,
            'password': password,
            'mUniqueId': ynw_user.mUniqueId
          };
          // this.lStorageService.clearLocalstorage();
          this.shared_functions.doLogout().then(
            () => {
              this.shared_functions.providerLogin(post_data);
              this.lStorageService.setitemonLocalStorage('version', cVersion);
            });
        } else {
          this.lStorageService.setitemonLocalStorage('version', cVersion);
        }
      }
    });
  }
}

