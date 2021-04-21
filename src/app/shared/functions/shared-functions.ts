import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { SharedServices } from '../services/shared-services';
// import { projectConstants } from '../../app.component';
import { Messages } from '../constants/project-messages';
import { ConfirmBoxComponent } from '../components/confirm-box/confirm-box.component';
import { Observable, Subject } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { DateFormatPipe } from '../pipes/date-format/date-format.pipe';
import { ProviderDataStorageService } from '../../ynw_provider/services/provider-datastorage.service';
import { ProviderServices } from '../../ynw_provider/services/provider-services.service';
import { GroupStorageService } from '../services/group-storage.service';
import { LocalStorageService } from '../services/local-storage.service';
import { SessionStorageService } from '../services/session-storage.service';
import { FileService } from '../services/file-service';
@Injectable()

export class SharedFunctions {
  holdbdata: any = [];
  // dont_delete_localstorage = ['ynw-locdet', 'ynw-createprov', 'supportName', 'supportPass', 'userType', 'version', 'activeSkin', 'jld', 'qrp', 'qB']; // ['isBusinessOwner'];
  private subject = new Subject<any>();
  private switchSubject = new Subject<any>();
  mUniqueId;
  tdata: any;
  constructor(private shared_service: SharedServices, private router: Router,
    private dialog: MatDialog, public provider_services: ProviderServices,
    public dateformat: DateFormatPipe,
    private providerDataStorage: ProviderDataStorageService,
    private groupService: GroupStorageService,
    private lStorageService: LocalStorageService,
    private sessionStorageService: SessionStorageService,
    private fileService: FileService
  ) { }

  logout() {
    this.doLogout()
      .then(
        data => {
          this.router.navigate(['/home']);
        },
        error => {
        }
      );
  }

  logoutNoRedirect() {
    this.doLogout()
      .then(
        data => {
        },
        error => {
        }
      );
  }

  callMaintanance() {
    const promise = new Promise<void>((resolve) => {
      resolve();
    });
    return promise;
  }

  doLogout() {
    const promise = new Promise<void>((resolve, reject) => {
      if (this.lStorageService.getitemfromLocalStorage('isBusinessOwner') === 'true') {
        this.providerLogout()
          .then(
            data => {
              resolve();
            }
          );
      } else {
        this.consumerLogout()
          .then(
            data => {
              resolve();
            }
          );
      }
    });
    return promise;
  }
  private consumerLogout() {
    const promise = new Promise<void>((resolve, reject) => {
      this.shared_service.ConsumerLogout()
        .subscribe(data => {
          this.lStorageService.clearLocalstorage();
          this.sessionStorageService.clearSessionStorage();
          // this.clearSessionStorage();
          resolve();
        },
          error => {
            resolve();
          }
        );
    });
    return promise;
  }

  private providerLogout() {
    const promise = new Promise<void>((resolve, reject) => {
      this.shared_service.ProviderLogout()
        .subscribe(data => {
          this.providerDataStorage.setWeightageArray([]);
          this.lStorageService.clearLocalstorage();
          this.sessionStorageService.clearSessionStorage();
          // this.clearSessionStorage();
          resolve();
        },
          error => {
            resolve();
          }
        );
    });
    return promise;
  }
  consumerLogin(post_data, moreParams?) {
    post_data.mUniqueId = this.lStorageService.getitemfromLocalStorage('mUniqueId');
    this.sendMessage({ ttype: 'main_loading', action: true });
    const promise = new Promise((resolve, reject) => {
      this.shared_service.ConsumerLogin(post_data)
        .subscribe(
          data => {
            resolve(data);
            this.setLoginData(data, post_data, 'consumer');
            if (moreParams === undefined) {
              this.router.navigate(['/consumer']);
            } else {
              if (moreParams['bypassDefaultredirection'] === 1) {
                // const mtemp = '1';
              } else {
                this.router.navigate(['/consumer']);
              }
            }
          },
          error => {
            this.sendMessage({ ttype: 'main_loading', action: false });
            if (error.status === 401) {
              // Not registred consumer or session alredy exists
              reject(error);
              // this.logout(); // commented as reported in bug report of getting reloaded on invalid user
            } else {
              if (error.error && typeof (error.error) === 'object') {
                error.error = Messages.API_ERROR;
              }
              reject(error);
            }
          });
    });
    return promise;
  }

  businessLogin(post_data) {
    this.sendMessage({ ttype: 'main_loading', action: true });
    const promise = new Promise((resolve, reject) => {
      this.shared_service.ProviderLogin(post_data)
        .subscribe(
          data => {
            this.providerDataStorage.setWeightageArray([]);
            this.lStorageService.setitemonLocalStorage('popupShown', 'false');
            this.setLoginData(data, post_data, 'provider');
            resolve(data);
          },
          error => {
            this.sendMessage({ ttype: 'main_loading', action: false });
            if (error.status === 401) {
              reject(error);
              // this.logout(); // commented as reported in bug report of getting reloaded on invalid user
            } else {
              if (error.error && typeof (error.error) === 'object') {
                error.error = Messages.API_ERROR;
              }
              reject(error);
            }
          });
    });
    return promise;
  }
  providerLogin(post_data) {
    this.sendMessage({ ttype: 'main_loading', action: true });
    const promise = new Promise((resolve, reject) => {
      this.shared_service.ProviderLogin(post_data)
        .subscribe(
          data => {
            this.providerDataStorage.setWeightageArray([]);
            this.lStorageService.setitemonLocalStorage('popupShown', 'false');
            this.setLoginData(data, post_data, 'provider');
            resolve(data);
            this.router.navigate(['/provider']);
          },
          error => {
            this.sendMessage({ ttype: 'main_loading', action: false });
            if (error.status === 401) {
              reject(error);
              // this.logout(); // commented as reported in bug report of getting reloaded on invalid user
            } else {
              if (error.error && typeof (error.error) === 'object') {
                error.error = Messages.API_ERROR;
              }
              reject(error);
            }
          });
    });
    return promise;
  }

  adminLogin(post_data, type) {
    this.sendMessage({ ttype: 'main_loading', action: true });
    const promise = new Promise((resolve, reject) => {
      this.shared_service.adminLogin(post_data, type)
        .subscribe(
          data => {
            resolve(data);
            this.setLoginData(data, post_data, 'provider');
            this.router.navigate(['/provider']);
          },
          error => {
            this.sendMessage({ ttype: 'main_loading', action: false });
            if (error.status === 401) {
              reject(error);
              // this.logout(); // commented as reported in bug report of getting reloaded on invalid user
            } else {
              if (error.error && typeof (error.error) === 'object') {
                error.error = Messages.API_ERROR;
              }
              reject(error);
            }
          });
    });
    return promise;
  }

  public setLoginData(data, post_data, mod) {
    this.groupService.setitemToGroupStorage('ynw-user', data);
    this.lStorageService.setitemonLocalStorage('isBusinessOwner', (mod === 'provider') ? 'true' : 'false');
    if (mod === 'provider') {
    }
    delete post_data['password'];
    this.lStorageService.setitemonLocalStorage('ynw-credentials', JSON.stringify(post_data));
  }
  public checkLogin() {
    const login = (this.lStorageService.getitemfromLocalStorage('ynw-credentials')) ? true : false;
    return login;
  }

  public isBusinessOwner(passtyp?) {
    let is_business_owner;
    if (this.lStorageService.getitemfromLocalStorage('isBusinessOwner')) {
      if (passtyp === 'returntyp') {
        is_business_owner = (this.lStorageService.getitemfromLocalStorage('isBusinessOwner') === 'true') ? 'provider' : 'consumer';
      } else {
        is_business_owner = (this.lStorageService.getitemfromLocalStorage('isBusinessOwner') === 'true') ? true : false;
      }
    } else {
      if (passtyp === 'returntyp') {
        is_business_owner = '';
      } else {
        is_business_owner = false;
      }
    }
    return is_business_owner;
  }

  public getCurrentUTCdatetimestring() {
    const curdate = new Date();
    const cdate = new Date(Date.UTC(curdate.getUTCFullYear(), curdate.getUTCMonth(), curdate.getUTCDate(), curdate.getUTCHours(),
      curdate.getUTCMinutes(), curdate.getUTCSeconds(), curdate.getUTCMilliseconds()));
    return cdate.toISOString();
  }

  public showlogoicon(logo, moreparams?) {
    if (logo == null || logo === '') {
      return '../../assets/images/no_image_icon.png';
    } else {
      return logo;
    }
  }
  public showitemimg(logo, moreparams?) {
    if (logo == null || logo === '') {
      return 'assets/images/no_image_icon.png';
    } else {
      return logo;
    }
  }
  public showjplimg(logo, moreparams?) {
    if (logo == null || logo === '') {
      return 'assets/images/img-null.svg';
    } else {
      return logo;
    }
  }
  public tosentenceCase(str) { /* Convert string to sentence case*/
    if ((str === null) || (str === '')) {
      return false;
    } else {
      str = str.toString();
    }
    return str.replace(/\w\S*/g, function (txt) { return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(); });
  }

  public getProfile() {
    const promise = new Promise((resolve, reject) => {
      const user = this.groupService.getitemFromGroupStorage('ynw-user');
      if (!user.id) {
        this.router.navigate(['logout']);
      }
      this.shared_service.getProfile(user.id, this.isBusinessOwner('returntyp'))
        .subscribe(
          data => {
            resolve(data);
          },
          error => {
            reject(error);
          });

    });
    return promise;
  }

  getNearByLocation(centerLat: number, centerLon: number, distanceMetrix, loctype?) {
    let distance = 0;
    switch (loctype) {
      case 'state':
        distance = distanceMetrix['state'];
        break;
      case 'city':
        distance = distanceMetrix['city'];
        break;
      case 'area':
        distance = distanceMetrix['area'];
        break;
      case 'metro':
        distance = distanceMetrix['metro'];
        break;
      case 'capital':
        distance = distanceMetrix['capital'];
        break;
      default:
        distance = distanceMetrix['area'];
        break;
    }
    const distInDegree = distance / 111;
    const upperLeftLat = Number(centerLat) - Number(distInDegree);
    const upperLeftLon = Number(centerLon) + Number(distInDegree);
    const lowerRightLat = Number(centerLat) + Number(distInDegree);
    const lowerRightLon = Number(centerLon) - Number(distInDegree);
    const locationRange = '[\'' + lowerRightLat + ',' + lowerRightLon + '\',\'' + upperLeftLat + ',' + upperLeftLon + '\']';
    const retarr = { 'locationRange': locationRange, 'upperLeftLat': upperLeftLat, 'upperLeftLon': upperLeftLon, 'lowerRightLat': lowerRightLat, 'lowerRightLon': lowerRightLon };
    return retarr;
  }

  getS3Url(src?) {
    const promise = new Promise((resolve, reject) => {
      // if (this.lStorageService.getitemfromLocalStorage('s3Url')) {
      //   resolve(this.lStorageService.getitemfromLocalStorage('s3Url'));
      // } else {
      this.shared_service.gets3url(src)
        .subscribe(
          data => {
            this.lStorageService.setitemonLocalStorage('s3Url', data);
            resolve(data);
          },
          error => {
            reject(error);
          });
      // }
    });
    return promise;
  }

  getCloudUrl() {
    const promise = new Promise((resolve, reject) => {
      if (this.lStorageService.getitemfromLocalStorage('cloudUrl')) {
        resolve(this.lStorageService.getitemfromLocalStorage('cloudUrl'));
      } else {
        this.shared_service.getCloudUrl()
          .subscribe(
            data => {
              this.lStorageService.setitemonLocalStorage('cloudUrl', data.toString());
              resolve(data);
            },
            error => {
              reject(error);
            });
      }
    });
    return promise;
  }

  get_Popularsarchlabels(labeltype, searchlabels_arr, params?) {
    let retdet = [];
    switch (labeltype) {
      case 'global':
        retdet = searchlabels_arr.popularSearchLabels.all.labels;
        break;
      case 'domain':
        Object.keys(searchlabels_arr.popularSearchLabels).forEach(keys => {
          const dom = params['domain'];
          if (keys === dom) {
            for (const labelarr of searchlabels_arr.popularSearchLabels[dom].labels) {
              retdet.push(labelarr);
            }
          }
        });
        break;
    }
    this.lStorageService.setitemonLocalStorage('popularSearch', retdet);
    const pdata = { 'ttype': 'popularSearchList', 'target': retdet };
    this.sendMessage(pdata);
    return retdet;
  }

  get_Searchlabels(labeltype, searchlabels_arr, params?) {
    let retdet = [];
    switch (labeltype) {
      case 'global':
        retdet = searchlabels_arr.globalSearchLabels;
        for (const labelarr of searchlabels_arr.sectorLevelLabels) {
          for (const subsecarr of labelarr.subSectorLevelLabels) {
            const result = subsecarr.specializationLabels.map(function (el) {
              const o = Object.assign({}, el);
              o.type = 'special';
              return o;
            });
            retdet.push.apply(retdet, result);
          }
        }
        break;
      case 'domain':
        for (const labelarr of searchlabels_arr.sectorLevelLabels) {
          if (labelarr.name === params['domain']) {
            for (const subsecarr of labelarr.subSectorLevelLabels) {
              retdet.push({ 'name': subsecarr.name, 'displayname': subsecarr.displayname, 'query': subsecarr.query, 'group': labelarr.name, 'type': 'subdomain' });
              const result = subsecarr.specializationLabels.map(function (el) {
                const o = Object.assign({}, el);
                o.type = 'special';
                return o;
              });
              retdet.push.apply(retdet, result);
            }
          }
        }
        break;
    }
    return retdet;
  }

  getSearchLabels(selected_domain) {
    const searchLabelsList = [];
    const domList = {
      'physiciansSurgeons': 'hospital',
      'dentists': 'dentalHosp',
      'alternateMedicinePractitioners': 'alternateMedicineHosp'
    };
    const ynw_conf = this.lStorageService.getitemfromLocalStorage('ynw-bconf');
    if (ynw_conf.bdata) {
      for (let i = 0; i < ynw_conf.bdata.length; i++) {
        if (ynw_conf.bdata[i].domain === selected_domain) {
          for (let subdom = 0; subdom < ynw_conf.bdata[i].subDomains.length; subdom++) {
            if (ynw_conf.bdata[i].subDomains[subdom].subDomain) {
              if (domList[ynw_conf.bdata[i].subDomains[subdom].subDomain]) {
                searchLabelsList.push({ 'name': ynw_conf.bdata[i].subDomains[subdom].subDomain, 'displayname': ynw_conf.bdata[i].subDomains[subdom].displayName, 'query': '?q=( and [loc_details] sector:\'' + ynw_conf.bdata[i].domain + '\' (or sub_sector:\'' + ynw_conf.bdata[i].subDomains[subdom].subDomain + '\' sub_sector:\'' + domList[ynw_conf.bdata[i].subDomains[subdom].subDomain] + '\'))&q.parser=structured&return=_all_fields', 'group': ynw_conf.bdata[i].domain, 'type': 'subdomain' });
              } else {
                searchLabelsList.push({ 'name': ynw_conf.bdata[i].subDomains[subdom].subDomain, 'displayname': ynw_conf.bdata[i].subDomains[subdom].displayName, 'query': '?q=( and [loc_details] sector:\'' + ynw_conf.bdata[i].domain + '\' sub_sector:\'' + ynw_conf.bdata[i].subDomains[subdom].subDomain + '\')&q.parser=structured&return=_all_fields', 'group': ynw_conf.bdata[i].domain, 'type': 'subdomain' });
              }
            }
            for (let special = 0; special < ynw_conf.bdata[i].subDomains[subdom].specializations.length; special++) {
              // tslint:disable-next-line: max-line-length
              searchLabelsList.push({ 'name': ynw_conf.bdata[i].subDomains[subdom].specializations[special].name, 'displayname': ynw_conf.bdata[i].subDomains[subdom].specializations[special].displayName, 'query': '?q=( and [loc_details] sector:\'' + ynw_conf.bdata[i].domain + '\' specialization:\'' + ynw_conf.bdata[i].subDomains[subdom].specializations[special].name + '\')&q.parser=structured&return=_all_fields', 'group': ynw_conf.bdata[i].subDomains[subdom].subDomain, 'subSector': ynw_conf.bdata[i].subDomains[subdom].displayName, 'type': 'special' });
            }
          }
        }
        if (selected_domain === 'All') {
          for (let subdom = 0; subdom < ynw_conf.bdata[i].subDomains.length; subdom++) {
            if (ynw_conf.bdata[i].subDomains[subdom].subDomain) {
              if (domList[ynw_conf.bdata[i].subDomains[subdom].subDomain]) {
                searchLabelsList.push({ 'name': ynw_conf.bdata[i].subDomains[subdom].subDomain, 'displayname': ynw_conf.bdata[i].subDomains[subdom].displayName, 'query': '?q=( and [loc_details] sector:\'' + ynw_conf.bdata[i].domain + '\' (or sub_sector:\'' + ynw_conf.bdata[i].subDomains[subdom].subDomain + '\' sub_sector:\'' + domList[ynw_conf.bdata[i].subDomains[subdom].subDomain] + '\'))&q.parser=structured&return=_all_fields' });
              } else {
                searchLabelsList.push({ 'name': ynw_conf.bdata[i].subDomains[subdom].subDomain, 'displayname': ynw_conf.bdata[i].subDomains[subdom].displayName, 'query': '?q=( and [loc_details] sector:\'' + ynw_conf.bdata[i].domain + '\' sub_sector:\'' + ynw_conf.bdata[i].subDomains[subdom].subDomain + '\')&q.parser=structured&return=_all_fields' });
              }
            }
            for (let special = 0; special < ynw_conf.bdata[i].subDomains[subdom].specializations.length; special++) {
              // tslint:disable-next-line: max-line-length
              searchLabelsList.push({ 'name': ynw_conf.bdata[i].subDomains[subdom].specializations[special].name, 'displayname': ynw_conf.bdata[i].subDomains[subdom].specializations[special].displayName, 'query': '?q=( and [loc_details] sector:\'' + ynw_conf.bdata[i].domain + '\' specialization:\'' + ynw_conf.bdata[i].subDomains[subdom].specializations[special].name + '\')&q.parser=structured&return=_all_fields', 'group': ynw_conf.bdata[i].subDomains[subdom].subDomain, 'subSector': ynw_conf.bdata[i].subDomains[subdom].displayName, 'type': 'special' });
            }
          }
        }
      }
    } else {
      this.shared_service.bussinessDomains()
        .subscribe(
          res => {
            const today = new Date();
            const postdata = {
              cdate: today,
              bdata: res
            };
            this.lStorageService.setitemonLocalStorage('ynw-bconf', postdata);
            this.getSearchLabels(selected_domain);
          }
        );
    }
    return searchLabelsList;
  }
  print_PricewithCurrency(price) {
    return '₹' + ' ' + price.toFixed(2);;
  }

  imageValidation(file, source?) {
    let file_types;
    if (source === 'attachment' || source === 'consumerimages') {
      file_types = this.fileService.getSupportedFormats('file');
    } else {
      file_types = this.fileService.getSupportedFormats('image');
    }
    const image_max_size = this.fileService.getMaximumImageSize();
    const error = [];
    let is_error = false;
    if (!file.type || (file.type && file_types.indexOf(file.type) === -1)) {
      error['type'] = true;
      is_error = true;
    }
    if (file.size && file.size > image_max_size) {
      error['size'] = true;
      is_error = true;
    }
    if (is_error === false) {
      return true;
    } else {
      return error;
    }
  }


  fileValidation(file) {
    // let file_types;
    //  if (source === 'attachment' || source === 'consumerimages' ) {
    //      file_types = projectConstants.FILETYPES_UPLOAD;
    //  } else {
    //      file_types = projectConstants.IMAGE_FORMATS;
    //  }
    const image_max_size = 15000000;
    const error = [];
    let is_error = false;
    if (file.size && file.size > image_max_size) {
      error['size'] = true;
      is_error = true;
    }
    if (is_error === false) {
      return true;
    } else {
      return error;
    }
  }

  getApiError(error) {
    if (error.error && typeof error.error === 'string') {
      return error.error;
    } else if (typeof error === 'string') {
      return error;
    } else {
      return Messages.API_ERROR;
    }
  }

  confirmGalleryImageDelete(ob, file) {
    ob.delgaldialogRef = this.dialog.open(ConfirmBoxComponent, {
      width: '50%',
      panelClass: ['commonpopupmainclass', 'confirmationmainclass'],
      disableClose: true,
      data: {
        'message': 'Do you want to delete this image ?',
        'heading': 'Delete Confirmation'
      }
    });

    ob.delgaldialogRef.afterClosed().subscribe(result => {
      if (result) {
        ob.deleteImage(file);
      }
    });
  }
  confirmSearchChangeStatus(ob, stat) {
    let msg = '';
    if (stat) {
      msg = 'If you "Turn off" List my profile in jaldee.com, Your profile will not be visible online at jaldee.com.';

      // msg = 'If you "Turn off" public search, Your profile will not be visible online at Jaldee.com.';
      // msg = '"Disable" the Public Search? You are offline. Your profile will not be visible online at Jaldee.com. Turn ON public search to accept online check ins';
    } else {
      msg = '"Turn On" List my profile in jaldee.com?';

    }
    const dialogRef = this.dialog.open(ConfirmBoxComponent, {
      width: '50%',
      panelClass: ['commonpopupmainclass', 'confirmationmainclass'],
      disableClose: true,
      data: {
        'message': msg,
        'heading': 'Public Search',
        'buttons': 'okCancel'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        ob.handle_searchstatus();
      } else {
        ob.getPublicSearch();
      }
    });
  }

  confirmSearchChangeStatusOfUser(ob, stat) {
    let msg = '';
    if (stat) {
      msg = 'If you " Turn off" Jaldee Online, You will not be visible online on Jaldee.com.';

      // msg = 'If you "Turn off" public search, Your profile will not be visible online at Jaldee.com.';
      // msg = '"Disable" the Public Search? You are offline. Your profile will not be visible online at Jaldee.com. Turn ON public search to accept online check ins';
    } else {
      msg = '"Turn On" Jaldee Online?';

    }
    const dialogRef = this.dialog.open(ConfirmBoxComponent, {
      width: '50%',
      panelClass: ['commonpopupmainclass', 'confirmationmainclass'],
      disableClose: true,
      data: {
        'message': msg,
        'heading': 'Public Search',
        'buttons': 'okCancel'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        ob.handle_searchstatus();
      } else {
        ob.getPublicSearch();
      }
    });
  }
  confirmOPSearchChangeStatus(ob, stat) {
    let msg = '';
    if (stat) {
      msg = 'If you " Turn off" Jaldee Online, You will not be visible online on Jaldee.com.';
      // msg = '"Disable" the Public Search? You are offline. Your profile will not be visible online at Jaldee.com. Turn ON public search to accept online check ins';
    } else {
      msg = '"Turn On" Jaldee Online?';
    }
    const dialogRef = this.dialog.open(ConfirmBoxComponent, {
      width: '50%',
      panelClass: ['commonpopupmainclass', 'confirmationmainclass'],
      disableClose: true,
      data: {
        'message': msg,
        'heading': 'Business profile',
        'buttons': 'okCancel'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        ob.handle_jaldeeOnlinePresence();
      } else {
        ob.getJaldeeIntegrationSettings();
      }
    });
  }
  confirmLogoImageDelete(ob, file) {
    const dialogRef = this.dialog.open(ConfirmBoxComponent, {
      width: '50%',
      panelClass: ['commonpopupmainclass', 'confirmationmainclass'],
      disableClose: true,
      data: {
        'message': 'Do you want to remove your profile picture?',
        'heading': 'Delete Confirmation',
        'buttons': 'okCancel'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        ob.removeLogo(file);
      }
    });
  }

  checkIsInteger(val) {
    return /^\d*$/.test(val);
  }

  // repeatFunction(ob) {
  //   setInterval(
  //     () => {
  //       ob.repeatFunctions();
  //     }, projectConstants.INTERVAL_TIME
  //   );
  // }

  getminutesOfDay(m) {
    return parseInt(m.minute, 10) + parseInt(m.hour, 10) * 60;
  }

  queueSheduleLoop(queueSchedule) {
    const schedule_arr = [];
    // extracting the schedule intervals
    if (queueSchedule && Object.keys(queueSchedule).length > 0 && queueSchedule.repeatIntervals) {
      for (let j = 0; j < queueSchedule.repeatIntervals.length; j++) {
        // pushing the schedule details to the respective array to show it in the page
        schedule_arr.push({
          day: queueSchedule.repeatIntervals[j],
          sTime: queueSchedule.timeSlots[0].sTime,
          eTime: queueSchedule.timeSlots[0].eTime
        });
      }
    }
    return schedule_arr;
  }
  // arrageScheduleforDisplay(schedule_arr) {
  //   const timebase: any = [];
  //   for (let i = 0; i < schedule_arr.length; i++) {
  //     const timeindx = schedule_arr[i]['sTime'].replace(/\s+/, '') + schedule_arr[i]['eTime'].replace(/\s+/, '');
  //     if (timebase[timeindx] === undefined) {
  //       timebase[timeindx] = new Array();
  //       timebase[timeindx].push(schedule_arr[i]);
  //     } else {
  //       timebase[timeindx].push(schedule_arr[i]);
  //     }
  //   }
  //   for (const obj in timebase) {
  //     if (obj) {
  //       const len = timebase[obj].length;
  //       for (let i = 0; i < len; i++) {
  //         for (let j = i + 1; j < len; j++) {
  //           if (timebase[obj][j].day < timebase[obj][i].day) {
  //             const tempobj = timebase[obj][i];
  //             timebase[obj][i] = timebase[obj][j];
  //             timebase[obj][j] = tempobj;
  //           }
  //         }
  //       }
  //     }
  //   }
  //   const displaysch = [];
  //   let pday = 0;
  //   for (const obj in timebase) {
  //     if (obj) {
  //       let curstr = '';
  //       let gap = 0;
  //       for (let i = 0; i < timebase[obj].length; i++) {
  //         if (i === 0) {
  //           curstr = this.getDay(timebase[obj][i].day);
  //           pday = timebase[obj][i].day;
  //         } else {
  //           const diffs = timebase[obj][i].day - pday;
  //           if (diffs > 1) {
  //             if (gap >= 1) {
  //               if (curstr.includes((this.getDay(pday)))) {
  //               } else {
  //                 curstr = curstr + ' - ' + this.getDay(pday);
  //               }
  //             }
  //             curstr = curstr + ', ' + this.getDay(timebase[obj][i].day);
  //           } else {
  //             if (i === (timebase[obj].length - 1)) {
  //               curstr = curstr + ' - ' + this.getDay(timebase[obj][i].day);
  //             }
  //             gap++;
  //           }
  //           pday = timebase[obj][i].day;
  //         }
  //       }
  //       displaysch.push({ 'time': timebase[obj][0]['sTime'] + ' - ' + timebase[obj][0]['eTime'], 'dstr': curstr, 'indx': obj, 'recurrtype': timebase[obj][0]['recurrtype'] });
  //     }
  //   }
  //   return displaysch;
  // }
  // getDay(num) {
  //   return projectConstants.myweekdaysSchedule[num];
  // }

  orderChangeWorkingHours(schedulearr) {
    const tmparr = schedulearr;
    for (let i = 0; i < tmparr.length; i++) {
      for (let j = i; j < tmparr.length; j++) {
        if (tmparr[j].day < tmparr[i].day) {
          const tempobj = tmparr[i];
          tmparr[i] = tmparr[j];
          tmparr[j] = tempobj;
        }
      }
    }
  }

  prepareScheduleforSaving(schedule_arr) {
    const timebase: any = [];
    for (let i = 0; i < schedule_arr.length; i++) {
      const timeindx = schedule_arr[i]['sTime'].replace(/\s+/, '') + schedule_arr[i]['eTime'].replace(/\s+/, '');
      if (timebase[timeindx] === undefined) {
        timebase[timeindx] = new Array();
        timebase[timeindx].push(schedule_arr[i]);
      } else {
        timebase[timeindx].push(schedule_arr[i]);
      }
    }
    for (const obj in timebase) {
      if (obj) {
        const len = timebase[obj].length;
        for (let i = 0; i < len; i++) {
          for (let j = i + 1; j < len; j++) {
            if (timebase[obj][j].day < timebase[obj][i].day) {
              const tempobj = timebase[obj][i];
              timebase[obj][i] = timebase[obj][j];
              timebase[obj][j] = tempobj;
            }
          }
        }
      }
    }
    const displaysch = [];
    for (const obj in timebase) {
      if (obj) {
        const curstr = [];
        for (let i = 0; i < timebase[obj].length; i++) {
          curstr.push(timebase[obj][i].day);
        }
        displaysch.push({ 'stime': timebase[obj][0]['sTime'], 'etime': timebase[obj][0]['eTime'], 'daystr': curstr });
      }
    }
    return displaysch;
  }

  setBusinessDetailsforHeaderDisp(bname, sector, subsector, logo, forcelogoblank?) {
    const buss_det = { 'bn': '', 'bs': '', 'bss': '', 'logo': '' };
    const exist_det = this.groupService.getitemFromGroupStorage('ynwbp');
    if (exist_det) {
      buss_det.bn = bname || '';
      buss_det.bs = sector || '';
      buss_det.bss = subsector || '';
      if (forcelogoblank !== undefined) {
        buss_det.logo = '';
      } else {
        buss_det.logo = (logo !== '') ? logo : exist_det['logo'];
      }
    } else {
      buss_det.bn = bname;
      buss_det.bs = sector;
      buss_det.bss = subsector;
      buss_det.logo = logo;
    }
    this.groupService.setitemToGroupStorage('ynwbp', buss_det);
  }
  retSubSectorNameifRequired(domain, subdomainname) {
    const bprof = this.lStorageService.getitemfromLocalStorage('ynw-bconf');
    if (bprof === null || bprof === undefined || bprof.bdata === null || bprof.bdata === undefined) {
      this.shared_service.bussinessDomains()
        .subscribe(
          res => {
            this.holdbdata = res;
            const today = new Date();
            const postdata = {
              cdate: today,
              bdata: this.holdbdata
            };
            const bprofn = postdata;
            const getdata = this.compareData(bprofn, domain, subdomainname);
            return getdata;
          }
        );
    } else {
      const getdata = this.compareData(bprof, domain, subdomainname);
      return getdata;
    }
  }
  compareData(bprof, domain, subdomainname) {
    let retsubdom = '';
    for (let i = 0; i < bprof.bdata.length; i++) {
      if (bprof.bdata[i]['domain'] === domain) {
        if (bprof.bdata[i].subDomains.length > 1) {
          retsubdom = subdomainname;
          return retsubdom;
        }
      }
    }
    return retsubdom;
  }

  sendSwitchMessage(message: any) {
    this.switchSubject.next(message);
  }

  sendMessage(message: any) {
    this.subject.next(message);
  }
  clearSwitchMessage() {
    this.switchSubject.next();
  }
  clearMessage() {
    this.subject.next();
  }
  getSwitchMessage(): Observable<any> {
    return this.switchSubject.asObservable();
  }

  getMessage(): Observable<any> {
    return this.subject.asObservable();
  }

  isNumberOnly(str) {
    const pattern = /^\d+$/;
    return pattern.test(str);  // returns a boolean
  }



  redirectto(mod) {
    const usertype = this.isBusinessOwner('returntyp');
    switch (mod) {
      case 'profile':
        this.router.navigate([usertype, 'profile']);
        break;
      case 'change-password':
        this.router.navigate([usertype, 'change-password']);
        break;
      case 'change-mobile':
        this.router.navigate([usertype, 'change-mobile']);
        break;
      case 'change-email':
        this.router.navigate([usertype, 'change-email']);
        break;
      case 'members':
        this.router.navigate([usertype, 'members']);
        break;
      case 'dashboard':
        this.router.navigate([usertype]);
        break;
    }
  }
  Lbase64Encode(str) {
    let retstr = '';
    if (str !== '' && str !== undefined) {
      retstr = str.replace('/(/g', '~');
      retstr = retstr.replace('/)/g', '~~');
      return retstr;
    } else {
      return str;
    }
  }
  Lbase64Decode(str) {
    let retstr = '';
    if (str !== '' && str !== undefined) {
      retstr = str.replace('/~~/g', ')');
      retstr = retstr.replace('/~/g', '(');
      return retstr;
    } else {
      return str;
    }
  }
  doCancelWaitlist(waitlist, type, cthis?) {
    console.log(waitlist);
    // let prepay = false;
    // if (type === 'checkin' || type === 'appointment') {
    //   if (waitlist.service.minPrePaymentAmount) {
    //     if (waitlist.service.minPrePaymentAmount > 0) {
    //       prepay = true;
    //     }
    //   }
    // }
    // if (type === 'order') {
    //   if (waitlist.advanceAmountPaid) {
    //     if (waitlist.advanceAmountPaid > 0) {
    //       prepay = true;
    //     }
    //   }
    // }
    let msg;
    if (type === 'checkin') {
      if (waitlist.token) {
        msg = 'booking';
      } else {
        msg = 'booking';
      }
    } else if (type === 'appointment') {
      msg = 'booking';
    } else if (type === 'order') {
      msg = 'Order';
    }
   // if (prepay) {
      this.tdata = {
        'message': 'Cancellation and Refund policy',
        'heading': 'Confirm',
        'type': 'yes/no',
        'cancelPolicy': 'show',
        'book': msg,
        'wtlist': waitlist
      }
    // } else {
    //   this.tdata = {
    //     'message': 'Do you want to cancel this ' + msg + '?',
    //     'heading': 'Confirm',
    //     'type': 'yes/no'
    //   }
    // }

    return new Promise((resolve, reject) => {
      cthis.canceldialogRef = this.dialog.open(ConfirmBoxComponent, {
        width: '50%',
        panelClass: ['commonpopupmainclass', 'confirmationmainclass'],
        disableClose: true,
        data: this.tdata
      });

      cthis.canceldialogRef.afterClosed().subscribe(result => {
        if (result) {
          let id;
          if (type === 'checkin') {
            id = waitlist.ynwUuid;
          } else if (type === 'appointment') {
            id = waitlist.uid;
          } else if (type === 'order') {
            id = waitlist.uid;
          }
          this.cancelWaitlist(id, waitlist.providerAccount.id, type)
            .then(
              data => {
                resolve(data);
              },
              error => {
                reject(error);
              }
            );
        } else {
          resolve(null);
        }
      });
    });
  }
  cancelWaitlist(id, provider_id, type) {
    return new Promise((resolve, reject) => {
      const params = {
        'account': provider_id
      };
      this.shared_service.deleteWaitlist(id, params, type)
        .subscribe(
          data => {
            resolve('reloadlist');
          },
          error => {
            reject(error);
          }
        );
    });
  }
  doDeleteFavProvider(fav, cthis?) {
    return new Promise((resolve, reject) => {
      this.deleteFavProvider(fav.id)
        .then(
          data => {
            resolve(data);
          },
          error => {
            reject(error);
          }
        );
    });
  }
  deleteFavProvider(id) {
    return new Promise((resolve, reject) => {
      this.shared_service.removeProviderfromFavourite(id)
        .subscribe(
          data => {
            resolve('reloadlist');
          },
          error => {
            reject(error);
          }
        );
    });
  }
  ratingRounding(val) {
    let retval;
    val = parseFloat(val);
    for (let i = 0; i <= 4.5; i = i + .5) {
      if (val > i && val <= (i + .5)) {
        retval = (i + .5);
      }
    }
    if (val === 0.0) {
      retval = 0;
    }
    return retval;
  }

  roundToTwoDecimel(amt) {
    return Math.round(amt * 100) / 100; // for only two decimal
  }

  isValid(evt) {
    // tslint:disable-next-line:radix
    const value = parseInt(evt.target.value);
    // tslint:disable-next-line:radix
    const max = parseInt(evt.target.max);
    if (value > max) {
      let numString = evt.target.value;
      evt.preventDefault();
      numString = numString.substr(0, numString.length - 1);
      // tslint:disable-next-line:radix
      evt.target.value = parseInt(numString);
      return false;
    }
    return true;
  }

  isInRange(evt) {
    const plceValue = evt.target.placeholder;
    let value1 = evt.target.value;
    if (plceValue === 'HH') {
      if (value1 > 23) {
        evt.preventDefault();
        value1 = value1.substr(0, value1.length - 1);
        // tslint:disable-next-line:radix
        evt.target.value = parseInt(value1);
        return false;
      }
      return true;
    } else {
      if (value1 > 59) {
        evt.preventDefault();
        value1 = value1.substr(0, value1.length - 1);
        // tslint:disable-next-line:radix
        evt.target.value = parseInt(value1);
        return false;
      }
      return true;
    }
  }

  isNumeric(evt) {
    const inputKeyCode = evt.keyCode ? evt.keyCode : evt.which;
    if ((inputKeyCode >= 48 && inputKeyCode <= 57) || inputKeyCode === 8 || inputKeyCode === 46) {
      return true;
    } else {
      evt.preventDefault();
      return false;
    }
  }
  isNumber(evt) {
    evt = (evt) ? evt : window.event;
    const charCode = (evt.which) ? evt.which : evt.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  isNumericforToken(evt) {
    const inputKeyCode = evt.keyCode ? evt.keyCode : evt.which;
    if (inputKeyCode < 48 || inputKeyCode > 57) {
      evt.preventDefault();
      return false;
    } else {
      evt.val(evt.val().replace(/[^\d].+/, ''));
      return true;
    }
  }

  removSpace(evt) {
    const inputKeyCode = evt.keyCode ? evt.keyCode : evt.which;
    if (inputKeyCode === 32) {
      evt.preventDefault();
      return false;
    }
  }
  removSpecChar(evt) {
    const s = '!@#$%^&*()+=-[]\\\';,./{}|\":<>?';
    for (let i = 0; i < evt.key.length; i++) {
      if (s.indexOf(evt.key.charAt(i)) !== -1) {
        evt.preventDefault();
        return false;
      }
    }
  }

  filterJson(jsonArray, key, value) {
    const newArray = jsonArray.filter(function (el) {
      return el[key] === value;
    });
    return newArray;
  }

  setBusinessAvailability(availability) {
    this.sendMessage({ ttype: 'available_status', availableStatus: availability });
  }
  sortByKey(array, key) {
    return array.sort(function (a, b) {
      const x = a[key]; const y = b[key];
      return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    });
  }
  sortByMapkey(array, key1, key2) {
    return array.sort(function (a, b) {
      const x = a[key1][key2]; const y = b[key1][key2];
      return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    });
  }
  groupBy(xs, key) {
    return xs.reduce(function (rv, x) {
      (rv[x[key]] = rv[x[key]] || []).push(x);
      return rv;
    }, {});
  }
  removeDuplicates(array, key) {
    const lookup = new Set();
    return array.filter(obj => !lookup.has(obj[key]) && lookup.add(obj[key]));
  }

  setFilter() {
    setTimeout(() => {
      const sidebar = document.getElementById('filterContainer');
      if (sidebar) {
        const height = (window.screen.height - 200) + 'px';
        sidebar.setAttribute('style', 'overflow:auto;height:' + height);
      }
    }, 500);
  }

  getBase64Image() {
    const promise = new Promise(function (resolve, reject) {
      const img = new Image();
      // To prevent: "Uncaught SecurityError: Failed to execute 'toDataURL' on 'HTMLCanvasElement': Tainted canvases may not be exported."
      img.crossOrigin = 'Anonymous';
      img.onload = function () {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        const dataURL = canvas.toDataURL('image/png');
        resolve(dataURL.replace(/^data:image\/(png|jpg|jpeg|pdf);base64,/, ''));
      };
      img.src = '../../../../assets/images/jaldee-logo.png';
    });

    return promise;
  }

  b64toBlob(b64Data) {
    const contentType = 'image/png';
    const sliceSize = 512;

    const byteCharacters = atob(b64Data);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);

      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);

      byteArrays.push(byteArray);
    }

    const blob = new Blob(byteArrays, { type: contentType });
    return blob;
  }
  b64toBlobforSign(b64Data) {
    const byteString = atob(b64Data.split(',')[1]);
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);

    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: 'image/jpeg' });
  }

  getNumberArray(n: number): any[] {
    return Array(n);
  }
  getGlobalSettings() {
    return new Promise((resolve) => {
      let settings = this.groupService.getitemFromGroupStorage('settings');
      if (!settings) {
        this.provider_services.getGlobalSettings().subscribe(
          (data: any) => {
            settings = data;
            this.groupService.setitemToGroupStorage('settings', data);
            resolve(data);
          });
      } else {
        resolve(settings);
      }
    });
  }
  gotoActiveHome() {
    this.getGlobalSettings()
      .then(
        (settings: any) => {
          if (this.groupService.getitemFromGroupStorage('isCheckin') === 0) {
            if (settings.waitlist) {
              this.router.navigate(['provider', 'check-ins']);
            } else if (settings.appointment) {
              this.router.navigate(['provider', 'appointments']);
            } else if (settings.order) {
              this.router.navigate(['provider', 'orders']);
            } else {
              this.router.navigate(['provider', 'settings']);
            }
          } else {
            this.router.navigate(['provider', 'settings']);
          }
        });
  }
}
