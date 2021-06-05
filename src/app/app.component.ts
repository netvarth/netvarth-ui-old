import { Component, OnInit } from '@angular/core';
import { GlobalService } from './shared/services/global-service';
import { version } from './shared/constants/version';
import { LocalStorageService } from './shared/services/local-storage.service';
// import { Device } from '@ionic-native/device/ngx';
// import { FCM } from '@ionic-native/fcm/ngx';
// import { MatDialog } from '@angular/material/dialog';
// import { NotificationDialogComponent } from './shared/components/notification-dialog/notification-dialog.component';
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
    // private fcm: FCM,
    // // // private device: Device,
    // private dialog: MatDialog

  ) { }

  /**
   * Init Method
   * if version is null or different this method clears local storage items from a list.
   * sets the current version in the local storage
   * @returns projectConstants which represents the constant variables used in jaldee UI
   * 
   */
  ngOnInit() {
    console.log("In ngOnInit");
    // localStorage.setItem("token", '12345');
    let token = this.lStorageService.getitemfromLocalStorage('authToken');
    if (token) {
      let regexToReplace = /\-/gi;
      let authToken = token.replace(regexToReplace, "&");
      this.lStorageService.setitemonLocalStorage('authToken', authToken);
    }

    // this.fcm.getToken().then(token => {
    //   console.log(token);
    //   this.lStorageService.setitemonLocalStorage('mUniqueId', token);
    // });

    // this.fcm.onNotification().subscribe(data => {
    //   if (data.wasTapped) {
    //     console.log("Received in background");
    //     const dialogrefd = this.dialog.open(NotificationDialogComponent, {
    //       width: '50%',
    //       panelClass: ['commonpopupmainclass', 'confirmationmainclass'],
    //       disableClose: true,
    //       data: {
    //         'message': data.body,
    //         'title': data.title,
    //         'btnOkTitle': 'OK'
    //       }
    //     });
    //     dialogrefd.afterClosed().subscribe(result => {
    //       console.log(result);
    //     });
    //   } else {
    //     console.log("Received in foreground");
    //     const dialogrefd = this.dialog.open(NotificationDialogComponent, {
    //       width: '50%',
    //       panelClass: ['commonpopupmainclass', 'confirmationmainclass'],
    //       disableClose: true,
    //       data: {
    //         'message': data.body,
    //         'title': data.title,
    //         'btnOkTitle': 'OK'
    //       }
    //     });
    //     dialogrefd.afterClosed().subscribe(result => {
    //       console.log(result);
    //     });
    //   }
    // });

    // this.fcm.onTokenRefresh().subscribe(token => {
    //   console.log(token);
    //   this.lStorageService.setitemonLocalStorage('mUniqueId', token);
    // });

    // this.fcm.hasPermission().then(hasPermission => {
    //   if (hasPermission) {
    //     console.log("Has permission!");
    //   }
    // })

    // this.fcm.clearAllNotifications();
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

