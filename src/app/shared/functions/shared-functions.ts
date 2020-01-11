import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { SharedServices } from '../services/shared-services';
import { projectConstants } from '../constants/project-constants';
import { Messages } from '../constants/project-messages';
import { ConfirmBoxComponent } from '../components/confirm-box/confirm-box.component';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { MatDialog, MatSnackBar } from '@angular/material';
import { CommonDataStorageService } from '../services/common-datastorage.service';
import * as moment from 'moment';
import { start } from 'repl';
@Injectable()

export class SharedFunctions {
  holdbdata: any = [];
  dont_delete_localstorage = ['ynw-locdet', 'ynw-createprov', 'supportName', 'supportPass', 'userType']; // ['isBusinessOwner'];
  private subject = new Subject<any>();
  private switchSubject = new Subject<any>();
  mUniqueId;
  constructor(private shared_service: SharedServices, private router: Router,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private common_datastorage: CommonDataStorageService
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

  doLogout() {
    const promise = new Promise((resolve, reject) => {
      if (localStorage.getItem('isBusinessOwner') === 'true') {
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
    const promise = new Promise((resolve, reject) => {
      this.shared_service.ConsumerLogout()
        .subscribe(data => {
          this.clearLocalstorage();
          this.clearSessionStorage();
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
    const promise = new Promise((resolve, reject) => {
      this.shared_service.ProviderLogout()
        .subscribe(data => {
          this.clearLocalstorage();
          this.clearSessionStorage();
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
    post_data.mUniqueId = localStorage.getItem('mUniqueId');
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
                const mtemp = '1';
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

  providerLogin(post_data) {
    this.sendMessage({ ttype: 'main_loading', action: true });
    const promise = new Promise((resolve, reject) => {
      this.shared_service.ProviderLogin(post_data)
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

  adminLogin(post_data) {
    this.sendMessage({ ttype: 'main_loading', action: true });
    const promise = new Promise((resolve, reject) => {
      this.shared_service.adminLogin(post_data)
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
    // localStorage.setItem('ynw-user', JSON.stringify(data));
    this.setitemToGroupStorage('ynw-user', data);
    localStorage.setItem('isBusinessOwner', (mod === 'provider') ? 'true' : 'false');
    if (mod === 'provider') {

    }
    delete post_data['password'];
    localStorage.setItem('ynw-credentials', JSON.stringify(post_data));
  }

  public clearLocalstorage() {
    this.removeitemfromLocalStorage('ynw-credentials');
    for (let index = 0; index < localStorage.length; index++) {
      if (this.dont_delete_localstorage.indexOf(localStorage.key(index)) === -1) {
        localStorage.removeItem(localStorage.key(index));
        index = index - 1; // manage index after remove
      }
    }
  }
  public clearSessionStorage() {
    for (let index = 0; index < sessionStorage.length; index++) {
      sessionStorage.removeItem(sessionStorage.key(index));
      index = index - 1; // manage index after remove
    }
  }
  public checkLogin() {
    const login = (localStorage.getItem('ynw-credentials')) ? true : false;
    return login;
  }

  public isBusinessOwner(passtyp?) {
    let is_business_owner;
    if (localStorage.getItem('isBusinessOwner')) {
      if (passtyp === 'returntyp') {
        is_business_owner = (localStorage.getItem('isBusinessOwner') === 'true') ? 'provider' : 'consumer';
      } else {
        is_business_owner = (localStorage.getItem('isBusinessOwner') === 'true') ? true : false;
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

  public getitemfromLocalStorage(itemname) { // function to get local storage item value
    if (localStorage.getItem(itemname) !== 'undefined') {
      return JSON.parse(localStorage.getItem(itemname));
    }
  }
  public setitemonLocalStorage(itemname, itemvalue) { // function to set local storage item value
    localStorage.setItem(itemname, JSON.stringify(itemvalue));
  }
  public removeitemfromLocalStorage(itemname) {
    localStorage.removeItem(itemname);
  }

  public setitemOnSessionStorage(itemname, itemvalue) {
    sessionStorage.setItem(itemname, JSON.stringify(itemvalue));
  }
  public getitemfromSessionStorage(itemname) { // function to get local storage item value
    if (sessionStorage.getItem(itemname) !== 'undefined') {
      return JSON.parse(sessionStorage.getItem(itemname));
    }
  }
  public removeitemfromSessionStorage(itemname) {
    sessionStorage.removeItem(itemname);
  }

  public getGroup() {
    if (this.getitemfromSessionStorage('tabId')) {
      return this.getitemfromSessionStorage('accountid');
    } else {
      return 0;
    }
  }

  public setitemToGroupStorage(itemname, itemvalue) {
    const group = this.getGroup();
    let groupObj = {};
    if (localStorage.getItem(group)) {
      groupObj = JSON.parse(localStorage.getItem(group));
      if (groupObj) {
        groupObj[itemname] = itemvalue;
      }
    } else {
      groupObj[itemname] = itemvalue;
    }
    localStorage.setItem(group, JSON.stringify(groupObj));
  }
  public getitemFromGroupStorage(itemname, type?) {
    let group;
    if (type) {
      group = 0;
    } else {
      group = this.getGroup();
    }
    if (localStorage.getItem(group)) {
      const groupObj = JSON.parse(localStorage.getItem(group));
      if (groupObj[itemname] || (itemname === 'isCheckin' && groupObj[itemname] !== undefined)) {
        return groupObj[itemname];
      }
    }
  }
  public removeitemFromGroupStorage(itemname) {
    const group = this.getGroup();
    const groupObj = JSON.parse(localStorage.getItem(group));
    if (groupObj[itemname]) {
      delete groupObj[itemname];
      localStorage.setItem(group, JSON.stringify(groupObj));
    }
  }

  public setItemOnCookie(cname, cvalue, exdays = 30) {
    const d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    const expires = 'expires=' + d.toUTCString();
    document.cookie = cname + '=' + cvalue + ';' + expires + ';path=/';
  }
  public getItemOnCookie(cname) {
    const name = cname + '=';
    const decodedCookie = decodeURIComponent(document.cookie);
    const ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) === 0) {
        return c.substring(name.length, c.length);
      }
    }
    return '';
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
      const user = this.getitemFromGroupStorage('ynw-user');
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

  getNearByLocation(centerLat: number, centerLon: number, loctype?) {
    let distance = 0;
    switch (loctype) {
      case 'state':
        distance = projectConstants.DISTANCE_STATE;
        break;
      case 'city':
        distance = projectConstants.DISTANCE_CITY;
        break;
      case 'area':
        distance = projectConstants.DISTANCE_AREA;
        break;
      case 'metro':
        distance = projectConstants.DISTANCE_METRO;
        break;
      case 'capital':
        distance = projectConstants.DISTANCE_CAPITAL;
        break;
      default:
        distance = projectConstants.DISTANCE_AREA;
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
      if (localStorage.getItem('s3Url')) {
        resolve(localStorage.getItem('s3Url'));
      } else {
        this.shared_service.gets3url(src)
          .subscribe(
            data => {
              localStorage.setItem('s3Url', data.toString());
              resolve(data);
            },
            error => {
              reject(error);
            });
      }
    });
    return promise;
  }

  getCloudUrl() {
    const promise = new Promise((resolve, reject) => {
      if (localStorage.getItem('cloudUrl')) {
        resolve(localStorage.getItem('cloudUrl'));
      } else {
        this.shared_service.getCloudUrl()
          .subscribe(
            data => {
              localStorage.setItem('cloudUrl', data.toString());
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
    this.setitemonLocalStorage('popularSearch', retdet);
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
    const ynw_conf = this.getitemfromLocalStorage('ynw-bconf');
    if (ynw_conf.bdata) {
      for (let i = 0; i < ynw_conf.bdata.length; i++) {
        if (ynw_conf.bdata[i].domain === selected_domain) {
          for (let subdom = 0; subdom < ynw_conf.bdata[i].subDomains.length; subdom++) {
            searchLabelsList.push({ 'name': ynw_conf.bdata[i].subDomains[subdom].subDomain, 'displayname': ynw_conf.bdata[i].subDomains[subdom].displayName, 'query': '?q=( and [loc_details] sector:\'' + ynw_conf.bdata[i].domain + '\' sub_sector:\'' + ynw_conf.bdata[i].subDomains[subdom].subDomain + '\')&q.parser=structured&return=_all_fields', 'group': ynw_conf.bdata[i].domain, 'type': 'subdomain' });
            for (let special = 0; special < ynw_conf.bdata[i].subDomains[subdom].specializations.length; special++) {
              searchLabelsList.push({ 'name': ynw_conf.bdata[i].subDomains[subdom].specializations[special].name, 'displayname': ynw_conf.bdata[i].subDomains[subdom].specializations[special].displayName, 'query': '?q=( and [loc_details] sector:\'' + ynw_conf.bdata[i].domain + '\' specialization:\'' + ynw_conf.bdata[i].subDomains[subdom].specializations[special].name + '\')&q.parser=structured&return=_all_fields', 'group': ynw_conf.bdata[i].subDomains[subdom].subDomain, 'type': 'special' });
            }
          }
        }
        if (selected_domain === 'All') {
          for (let subdom = 0; subdom < ynw_conf.bdata[i].subDomains.length; subdom++) {
            searchLabelsList.push({ 'name': ynw_conf.bdata[i].subDomains[subdom].subDomain, 'displayname': ynw_conf.bdata[i].subDomains[subdom].displayName, 'query': '?q=( and [loc_details] sector:\'' + ynw_conf.bdata[i].domain + '\' sub_sector:\'' + ynw_conf.bdata[i].subDomains[subdom].subDomain + '\')&q.parser=structured&return=_all_fields' });
            for (let special = 0; special < ynw_conf.bdata[i].subDomains[subdom].specializations.length; special++) {
              searchLabelsList.push({ 'name': ynw_conf.bdata[i].subDomains[subdom].specializations[special].name, 'displayname': ynw_conf.bdata[i].subDomains[subdom].specializations[special].displayName, 'query': '?q=( and [loc_details] sector:\'' + ynw_conf.bdata[i].domain + '\' specialization:\'' + ynw_conf.bdata[i].subDomains[subdom].specializations[special].name + '\')&q.parser=structured&return=_all_fields', 'group': ynw_conf.bdata[i].subDomains[subdom].subDomain, 'type': 'special' });
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
            this.setitemonLocalStorage('ynw-bconf', postdata);
            this.getSearchLabels(selected_domain);
          }
        );
    }
    return searchLabelsList;
  }
  print_PricewithCurrency(price) {
    return '₹' + ' ' + price;
  }

  imageValidation(file) {
    const file_types = projectConstants.IMAGE_FORMATS;
    const image_max_size = projectConstants.IMAGE_MAX_SIZE;
    const error = [];
    let is_error = false;
    if (file.type && file_types.indexOf(file.type) === -1) {
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

  getApiError(error) {
    if (error.error && typeof error.error === 'string') {
      return error.error;
    } else if (typeof error === 'string') {
      return error;
    } else {
      return Messages.API_ERROR;
    }
  }

  apiErrorAutoHide(ob, error) {
    error = this.getApiError(error);
    const replaced_message = this.findTerminologyTerm(error);
    ob.api_error = this.firstToUpper(replaced_message);
    setTimeout(() => {
      ob.api_error = null;
    }, projectConstants.TIMEOUT_DELAY_LARGE10);
  }

  apiSuccessAutoHide(ob, message) {
    const replaced_message = this.findTerminologyTerm(message);
    ob.api_success = this.firstToUpper(replaced_message);
    setTimeout(() => {
      ob.api_success = null;
    }, projectConstants.TIMEOUT_DELAY_LARGE10);
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
      msg = 'If you "Turn off" public search, Your profile will not be visible online at Jaldee.com.';
      // msg = '"Disable" the Public Search? You are offline. Your profile will not be visible online at Jaldee.com. Turn ON public search to accept online check ins';
    } else {
      msg = '"Turn On" the Public Search?';
    }
    const dialogRef = this.dialog.open(ConfirmBoxComponent, {
      width: '50%',
      panelClass: ['commonpopupmainclass', 'confirmationmainclass'],
      disableClose: true,
      data: {
        'message': msg,
        'heading': 'Public Search'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        ob.handle_searchstatus();
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
        'heading': 'Delete Confirmation'
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

  repeatFunction(ob) {
    setInterval(
      () => {
        ob.repeatFunctions();
      }, projectConstants.INTERVAL_TIME
    );
  }

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
  arrageScheduleforDisplay(schedule_arr) {
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
    let pday = 0;
    for (const obj in timebase) {
      if (obj) {
        let curstr = '';
        let gap = 0;
        for (let i = 0; i < timebase[obj].length; i++) {
          if (i === 0) {
            curstr = this.getDay(timebase[obj][i].day);
            pday = timebase[obj][i].day;
          } else {
            const diffs = timebase[obj][i].day - pday;
            if (diffs > 1) {
              if (gap >= 1) {
                if (curstr.includes((this.getDay(pday)))) {
                } else {
                  curstr = curstr + ' - ' + this.getDay(pday);
                }
              }
              curstr = curstr + ', ' + this.getDay(timebase[obj][i].day);
            } else {
              if (i === (timebase[obj].length - 1)) {
                curstr = curstr + ' - ' + this.getDay(timebase[obj][i].day);
              }
              gap++;
            }
            pday = timebase[obj][i].day;
          }
        }
        displaysch.push({ 'time': timebase[obj][0]['sTime'] + ' - ' + timebase[obj][0]['eTime'], 'dstr': curstr, 'indx': obj, 'recurrtype': timebase[obj][0]['recurrtype'] });
      }
    }
    return displaysch;
  }
  getDay(num) {
    return projectConstants.myweekdaysSchedule[num];
  }

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
    const exist_det = this.getitemFromGroupStorage('ynwbp');
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
    this.setitemToGroupStorage('ynwbp', buss_det);
  }
  retSubSectorNameifRequired(domain, subdomainname) {
    const bprof = this.getitemfromLocalStorage('ynw-bconf');
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

  openSnackBar(message: string, params: any = []) {
    const panelclass = (params['panelClass']) ? params['panelClass'] : 'snackbarnormal';
    if (params['panelClass'] === 'snackbarerror') {
      message = this.getApiError(message);
    }
    let duration = projectConstants.TIMEOUT_DELAY_LARGE;
    if (params['duration']) {
      duration = params['duration'];
    }
    const replaced_message = this.findTerminologyTerm(message);
    const snackBarRef = this.snackBar.open(replaced_message, '', { duration: duration, panelClass: panelclass });
    return snackBarRef;
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

  getTimeSlotsFromQTimings(interval, startTime, endTime) {
    const slotList = [];
    slotList.push(startTime);
    const endDTime = this.getDateFromTimeString(endTime);
    let startingDTime = this.getDateFromTimeString(startTime);
    let exitLoop = false;
    while (!exitLoop) {
      const nextTime = moment(startingDTime).add(interval, 'm');
      const nextTimeDt = this.getDateFromTimeString(moment(nextTime, ['hh:mm A']).format('hh:mm A').toString());
      if (nextTimeDt.getTime() <= endDTime.getTime()  ) {
        slotList.push(moment(nextTime, ['hh:mm A']).format('hh:mm A').toString());

      } else {
        exitLoop = true;
      }
      startingDTime = nextTimeDt;
    }
    return slotList;
  }

  getDateFromTimeString(time) {
    const startTime = new Date();
    const parts = time.match(/(\d+):(\d+) (AM|PM)/);
    if (parts) {
        let hours = parseInt(parts[1], 0);
        const minutes = parseInt(parts[2], 0);
        const tt = parts[3];
        if (tt === 'PM' && hours < 12) {
          hours += 12;
        }
        startTime.setHours(hours, minutes, 0, 0);
    }
    return startTime;
  }
  convertMinutesToHourMinute(mins) {
    let rethr = '';
    let retmin = '';
    if (mins > 0) {
      const hr = Math.floor(mins / 60);
      const min = Math.floor(mins % 60);
      if (hr > 0) {
        if (hr > 1) {
          rethr = hr + ' hours';
        } else {
          rethr = hr + ' hour';
        }
      }
      if (min > 0) {
        if (min > 1) {
          retmin = ' ' + min + ' minutes';
        } else {
          retmin = ' ' + min + ' minute';
        }
      }
    } else {
      retmin = '' + 0 + ' minutes';
    }
    return rethr + retmin;
  }

  providerConvertMinutesToHourMinute(mins) {
    let rethr = '';
    let retmin = '';
    if (mins > 0) {
      const hr = Math.floor(mins / 60);
      const min = Math.floor(mins % 60);
      if (hr > 0) {
        if (hr > 1) {
          rethr = hr + ' Hrs';
        } else {
          rethr = hr + ' Hr';
        }
      }
      if (min > 0) {
        if (min > 1) {
          retmin = ' ' + min + ' Mins';
        } else {
          retmin = ' ' + min + ' Min';
        }
      }
    } else {
      retmin = '' + 0 + ' Min';
    }
    return rethr + retmin;
  }
  getdaysdifffromDates(date1, date2) {
    let firstdate;
    let seconddate;
    if (date1 === 'now') {
      firstdate = new Date();
    } else {
      firstdate = new Date(date1);
    }
    seconddate = new Date(date2);
    const timediff = Math.abs(firstdate.getTime() - seconddate.getTime());
    const hours = Math.abs(firstdate.getTime() - seconddate.getTime()) / 36e5; // 36e5 is the scientific notation for 60*60*1000
    return { 'hours': hours };
  }
  getTimeAsNumberOfMinutes(time) {
    const timeParts = time.split(':');
    const timeInMinutes = (parseInt(timeParts[0], 10) * 60) + parseInt(timeParts[1], 10);
    return timeInMinutes;
  }
  Lbase64Encode(str) {
    let retstr = '';
    if (str !== '' && str !== undefined) {
      retstr = str.replace('(', '~');
      retstr = retstr.replace(')', '~~');
      return retstr;
    } else {
      return str;
    }
  }
  Lbase64Decode(str) {
    let retstr = '';
    if (str !== '' && str !== undefined) {
      retstr = str.replace('~~', ')');
      retstr = retstr.replace('~', '(');
      return retstr;
    } else {
      return str;
    }
  }
  formatDate(psdate, params: any = []) { /* convert year-month-day to day-monthname-year*/
    const monthNames = {
      '01': 'Jan',
      '02': 'Feb',
      '03': 'Mar',
      '04': 'Apr',
      '05': 'May',
      '06': 'Jun',
      '07': 'Jul',
      '08': 'Aug',
      '09': 'Sep',
      '10': 'Oct',
      '11': 'Nov',
      '12': 'Dec'
    };
    const darr = psdate.split('-');
    if (params['rettype'] === 'monthname') {
      darr[1] = monthNames[darr[1]];
      return darr[1] + ' ' + darr[2];
    } else if (params['rettype'] === 'fullarr') {
      darr[1] = monthNames[darr[1]];
      return darr;
    } else {
      return darr[1] + ' ' + darr[2];
    }
  }
  addZero(i) {
    if (i < 10) {
      i = '0' + i;
    }
    return i;
  }
  convert24HourtoAmPm(time, secreq?) {
    const timesp = time.split(':');
    let hr = parseInt(timesp[0], 10);
    const min = parseInt(timesp[1], 10);
    const sec = parseInt(timesp[2], 10);
    let ampm = '';
    let retstr = '';
    if (hr >= 12) {
      hr = hr - 12;
      if (hr === 0) {
        hr = 12;
        ampm = 'PM';
      } else if (hr < 0) {
        ampm = 'AM';
      } else {
        ampm = 'PM';
      }
    } else {
      ampm = 'AM';
    }
    retstr = this.addZero(hr) + ':' + this.addZero(min);
    if (secreq) {
      retstr += ':' + sec;
    }
    retstr += ' ' + ampm;
    return retstr;
  }

  doCancelWaitlist(waitlist, cthis?) {
    return new Promise((resolve, reject) => {
      cthis.canceldialogRef = this.dialog.open(ConfirmBoxComponent, {
        width: '50%',
        panelClass: ['commonpopupmainclass', 'confirmationmainclass'],
        disableClose: true,
        data: {
          'message': 'Do you want to cancel this Check-In ?',
          'heading': 'Confirm',
          'type': 'yes/no'
        }
      });

      cthis.canceldialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.cancelWaitlist(waitlist.ynwUuid, waitlist.provider.id)
            .then(
              data => {
                resolve(data);
              },
              error => {
                reject(error);
              }
            );
        } else {
          resolve();
        }
      });
    });
  }
  cancelWaitlist(id, provider_id) {
    return new Promise((resolve, reject) => {
      const params = {
        'account': provider_id
      };
      this.shared_service.deleteWaitlist(id, params)
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
  setTerminologies(terminologies) {
    this.common_datastorage.set('terminologies', terminologies);
  }
  getTerminologies() {
    return this.common_datastorage.get('terminologies');
  }
  getTerminologyTerm(term) {
    const term_only = term.replace(/[\[\]']/g, '').toLowerCase();
    const terminologies = this.common_datastorage.get('terminologies');
    if (terminologies) {
      return (terminologies[term_only]) ? terminologies[term_only] : ((term === term_only) ? term_only : term);
    } else {
      return (term === term_only) ? term_only : term;
    }
  }

  removeTerminologyTerm(term, full_message) {
    const term_replace = this.getTerminologyTerm(term);
    const term_only = term.replace(/[\[\]']/g, ''); // term may me with or without '[' ']'
    return full_message.replace('[' + term_only + ']', term_replace);
  }

  toCamelCase(str) {
    return str;
  }

  firstToUpper(str) {
    if (str) {
      if (str.substr(0, 7) === 'http://' || str.substr(0, 8) === 'https://') {
        return str;
      } else {
        return str.charAt(0).toUpperCase() + str.substr(1);
      }
    }
  }

  findTerminologyTerm(message) {
    const matches = message.match(/\[(.*?)\]/g);
    let replaced_msg = message;

    if (matches) {
      for (const match of matches) {
        replaced_msg = this.removeTerminologyTerm(match, replaced_msg);
      }
    }
    return replaced_msg;
  }

  getProjectMesssages(key) {
    let message = Messages[key] || '';
    message = this.findTerminologyTerm(message);
    return this.firstToUpper(message);
  }

  getProjectErrorMesssages(error) {
    let message = this.getApiError(error);
    message = this.findTerminologyTerm(message);
    return this.firstToUpper(message);
  }

  roundToTwoDecimel(amt) {
    return Math.round(amt * 100) / 100; // for only two decimal
  }
  formatDateDisplay(dateStr) {
    const pubDate = new Date(dateStr);
    const obtshowdate = this.addZero(pubDate.getDate()) + '/' + this.addZero((pubDate.getMonth() + 1)) + '/' + pubDate.getFullYear();
    return obtshowdate;
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
  getLiveTrackStatusMessage(liveTrackInfo, businessName, mode) {
    if (liveTrackInfo && liveTrackInfo.jaldeeDistanceTime) {
      const distance = liveTrackInfo.jaldeeDistanceTime.jaldeeDistance.distance;
      const unit = projectConstants.LIVETRACK_CONST[liveTrackInfo.jaldeeDistanceTime.jaldeeDistance.unit];
      const travelTime = liveTrackInfo.jaldeeDistanceTime.jaldeelTravelTime.travelTime;
      const hours = Math.floor(travelTime / 60);
      const minutes = travelTime % 60;
      let message = '';
      if (distance === 0) {
        message += 'You are close to ' + businessName;
      } else {
        message += 'From your current location, you are ' + distance + ' ' + unit + ' away and will take around';
        if (hours !== 0) {
          message += ' ' + hours;
          if (hours === 1) {
            message += ' hr';
          } else {
            message += ' hrs';
          }
        }
        if (minutes !== 0) {
          message += ' ' + minutes;
          if (minutes === 1) {
            message += ' min';
          } else {
            message += ' mins';
          }
        }
        if (mode === 'WALKING') {
          message += ' walk';
        } else if (mode === 'DRIVING') {
          message += ' drive';
        } else if (mode === 'BICYCLING') {
          message += ' ride';
        }
        message += ' to reach ' + businessName;
      }
      return message;
    }
  }
}
