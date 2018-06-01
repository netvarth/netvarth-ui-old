import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { Router } from '@angular/router';
import { SharedServices } from '../services/shared-services';
import { projectConstants } from '../constants/project-constants';
import { Messages } from '../constants/project-messages';
import { ConfirmBoxComponent } from '../components/confirm-box/confirm-box.component';
import {Observable} from 'rxjs/Observable';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatSnackBar} from '@angular/material';
import { Subject } from 'rxjs/Subject';

@Injectable()

export class SharedFunctions {

    dont_delete_localstorage = ['ynw-locdet']; // ['isBusinessOwner'];

    private subject = new Subject<any>();

    constructor(private shared_service: SharedServices, private router: Router,
      private dialog: MatDialog,
      private snackBar: MatSnackBar,
    ) {}

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

    doLogout() {
      const promise = new Promise((resolve, reject) => {
        // if (localStorage.getItem('ynw-user')) {
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
        // } else {
        //   reject();
        // }
      });
      return promise;
    }
    private consumerLogout() {
      const promise = new Promise((resolve, reject) => {
        this.shared_service.ConsumerLogout()
        .subscribe(data => {
             // console.log(data);
             this.clearLocalstorage();
             resolve();
        },
        error => {
           // console.log(error);
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
              // console.log(data);
              this.clearLocalstorage();
              resolve();
         },
         error => {
            // console.log(error);
            resolve();
         }
         );
        });
        return promise;
      }

     consumerLogin(post_data, moreParams?) {

      const promise = new Promise((resolve, reject) => {
        this.shared_service.ConsumerLogin(post_data)
        .subscribe(
            data => {
                // console.log('more params', moreParams);
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
                if (error.status === 401) {
                // Not registred consumer or session alredy exists
                    reject(error);
                    this.logout();
                } else {
                    console.log('Something went wrong. Please try after sometime');
                    if (error.error && typeof(error.error) === 'object') {
                      error.error = Messages.API_ERROR;
                    }
                    reject(error);
                }
            });

      });
      return promise;

    }

    /* providerLogin(post_data) {

      const promise = new Promise((resolve, reject) => {
        this.shared_service.ProviderLogin(post_data)
        .subscribe(
            data => {
              resolve(data);
              console.log(data);
              this.setLoginData(data, post_data);
              this.router.navigate(['/provider']);

            },
            error => {

                if (error.status === 401) {
                  // Not registred provider or session alredy exists
                  this.consumerLogin(post_data)
                  .then(
                    data => resolve(data),
                    err => reject(err)
                  );
                } else {
                  console.log('Something went wrong. Please try after sometime');
                  reject(error);
                }
            });
        });
        return promise;
     }*/

     providerLogin(post_data) {

        const promise = new Promise((resolve, reject) => {
        this.shared_service.ProviderLogin(post_data)
        .subscribe(
            data => {
              resolve(data);
              // console.log(data);
              this.setLoginData(data, post_data, 'provider');
              this.router.navigate(['/provider']);

            },
            error => {
              if (error.status === 401) {
                reject(error);
                this.logout();
              } else {
                console.log('Something went wrong. Please try after sometime', error);
                if (error.error && typeof(error.error) === 'object') {
                  error.error = Messages.API_ERROR;
                }
                reject(error);
              }
            });
        });
        return promise;
     }



    public setLoginData(data, post_data, mod) {

          localStorage.setItem('ynw-user', JSON.stringify(data));
          // localStorage.setItem('isBusinessOwner', data['isProvider']);
          localStorage.setItem('isBusinessOwner', (mod === 'provider') ? 'true' : 'false');
          if (mod === 'provider') {

          }
          localStorage.setItem('ynw-credentials', JSON.stringify(post_data));

    }

    public clearLocalstorage() {

        for (let index = 0; index < localStorage.length; index++) {
              if (this.dont_delete_localstorage.indexOf(localStorage.key( index )) === -1) {
               localStorage.removeItem( localStorage.key( index ));
               index = index - 1; // manage index after remove
          }
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
          // console.log('origin', passtyp);
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
      return JSON.parse(localStorage.getItem(itemname));
    }
    public setitemonLocalStorage(itemname, itemvalue) { // function to set local storage item value
      localStorage.setItem(itemname, JSON.stringify(itemvalue));
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
      // const dates = date.toUTCString().slice(0, -4);
      // console.log('Inside'+dates);
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

    public tosentenceCase (str) { /* Convert string to sentence case*/
      if ((str === null) || (str === '')) {
           return false;
      } else {
       str = str.toString();
      }
     return str.replace(/\w\S*/g, function(txt) { return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(); } );
    }

    public getProfile() {
      const promise = new Promise((resolve, reject) => {
        const user = JSON.parse(localStorage.getItem('ynw-user'));
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

    /*getNearByLocation (centerLat: number, centerLon: number) {
        const d = 15000; // desired distance in meter
        const angle = 45 * Math.PI / 180; // 45 degrees in radians
        const oneDegree = 111319.9; // distance in meters from degree to degree at the equato
        // const maxLat = parseFloat(centerLat) + parseFloat((d / oneDegree) * Math.sin(angle));
        // const maxLon = parseFloat(centerLon) + parseFloat((d / (oneDegree * (Math.cos(centerLat * Math.PI / 180)))) * Math.cos(angle));
        const maxLat = Number(centerLat) + Number((d / oneDegree) * Math.sin(angle));
        const maxLon = Number(centerLon) + Number((d / (oneDegree * (Math.cos(centerLat * Math.PI / 180)))) * Math.cos(angle));
        // console.log(centerLat, ((d / oneDegree) * Math.sin(angle)),maxLat);
        // const minLat = centerLat - (d / oneDegree) * Math.sin(angle);
        //  const minLon = centerLon - (d / (oneDegree * (Math.cos(centerLat * Math.PI / 180)))) * Math.cos(angle);
        const locationRange = '[\'' + maxLat + ',' + maxLon + '\',\'' + centerLat + ',' + centerLon + '\']';
        return locationRange;
    }*/
    getNearByLocation (centerLat: number, centerLon: number, loctype?) {
      let distance = 0;
     // if (loctype === undefined || loctype === '') {
     //   distance = 5; // in KM
     // } else {
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
            default:
              distance = projectConstants.DISTANCE_AREA;
            break;
          }
      // }
      console.log('Distance for Cloud', distance, loctype);
      const distInDegree = distance / 111;
      // console.log(distInDegree);
      const upperLeftLat = Number(centerLat) - Number(distInDegree);
      const upperLeftLon = Number(centerLon) + Number(distInDegree);
      const lowerRightLat = Number(centerLat) + Number(distInDegree);
      const lowerRightLon = Number(centerLon) - Number(distInDegree);
      const locationRange = '[\'' + lowerRightLat + ',' + lowerRightLon + '\',\'' + upperLeftLat + ',' + upperLeftLon + '\']';
      // console.log(locationRange);
      const retarr = {'locationRange': locationRange, 'upperLeftLat': upperLeftLat, 'upperLeftLon': upperLeftLon, 'lowerRightLat': lowerRightLat, 'lowerRightLon': lowerRightLon};
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
                  data => { // console.log(data);
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

  get_Searchlabels(labeltype, searchlabels_arr, params?) {
    let retdet;
    switch (labeltype) {
        case 'global':
          retdet = searchlabels_arr.searchLabels[0].globalSearchLabels;
        break;
        case 'domain':
          for (const labelarr of searchlabels_arr.searchLabels[1].sectorLevelLabels) {
            if (labelarr.name === params['domain']) {
              retdet = labelarr.sectorLabels;
            }
          }
        break;
    }
    return retdet;
  }

  print_PricewithCurrency(price) {
    return '₹' + price ;
  }

  imageValidation (file) {

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
    if ( error.error && typeof error.error === 'string') {
      return  error.error;
    } else if (typeof error === 'string') {
        return error;
    } else {
      return Messages.API_ERROR;
    }
  }

  apiErrorAutoHide(ob, error) {
    error = this.getApiError(error);
    ob.api_error = error;
    setTimeout(() => {
      ob.api_error = null;
    }, projectConstants.TIMEOUT_DELAY_LARGE);
  }

  apiSuccessAutoHide(ob, message) {
    ob.api_success = message;
    setTimeout(() => {
      ob.api_success = null;
    }, projectConstants.TIMEOUT_DELAY_LARGE);
  }

  confirmGalleryImageDelete(ob, file) {
    const dialogRef = this.dialog.open(ConfirmBoxComponent, {
      width: '50%',
      panelClass : ['commonpopupmainclass', 'confirmationmainclass'],
      data: {
        'message' : 'Do you want to delete this image ?',
        'heading' : 'Delete Confirmation'
      }
    });

    dialogRef.afterClosed().subscribe(result => {

      if (result) {
        ob.deleteImage(file);
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

  arrageScheduleforDisplay(schedule_arr) {
    const timebase: any = [];
    for (let i = 0; i < schedule_arr.length; i++ ) {
      const timeindx = schedule_arr[i]['sTime'].replace(/\s+/, '') + schedule_arr[i]['eTime'].replace(/\s+/, '');
      // console.log('indx', timeindx);
      if (timebase[timeindx] === undefined) {
        timebase[timeindx] = new Array();
        timebase[timeindx].push(schedule_arr[i]);
      } else {
        timebase[timeindx].push(schedule_arr[i]);
      }
    }
    for (const obj in timebase) {
      if (obj) {
        // console.log('obj', obj);
        const len = timebase[obj].length;
        for (let i = 0; i < len; i++) {
          for (let j = i + 1 ; j < len; j++) {
            if (timebase[obj][j].day < timebase[obj][i].day) {
              const tempobj = timebase[obj][i];
              timebase[obj][i] = timebase[obj][j];
              timebase[obj][j] = tempobj;
            }
          }
        }
      }
    }
    // console.log('timebase', timebase);
    const displaysch = [];
    let pday = 0;
    for (const obj in timebase) {
      if (obj) {
        let curstr = '';
        // let pday = 0;
        let gap = 0;
        for (let i = 0; i < timebase[obj].length; i++) {
            if (i === 0) {
              curstr = this.getDay(timebase[obj][i].day);
              pday = timebase[obj][i].day;
            } else {
              const diffs = timebase[obj][i].day - pday;
              if (diffs > 1) {
                if (gap >= 1) {
                  curstr = curstr + ' - ' + this.getDay(pday);
                }
                curstr = curstr + ', ' + this.getDay(timebase[obj][i].day);
              } else {
                // console.log('cnts', i, timebase[obj].length);
                if (i === (timebase[obj].length - 1)) {
                  curstr = curstr + ' - ' + this.getDay(timebase[obj][i].day);
                }
                gap++;
              }
              pday = timebase[obj][i].day;
            }
        }
        displaysch.push({'time': timebase[obj][0]['sTime'] + ' - ' + timebase[obj][0]['eTime'], 'dstr': curstr});
        // console.log('curstr', curstr);
      }
    }
    // console.log('timebase', timebase);
    // console.log('displaystr', displaysch);
    return displaysch;
  }
  getDay(num) {
    return projectConstants.myweekdaysSchedule[num];
  }

  orderChangeWorkingHours(schedulearr) {
    const tmparr = schedulearr;
    // console.log('inside before', schedulearr);
    for (let i = 0; i < tmparr.length; i++ ) {
      for (let j = i; j < tmparr.length; j++ ) {
        if (tmparr[j].day < tmparr[i].day) {
          const tempobj = tmparr[i];
          tmparr[i] = tmparr[j];
          tmparr[j] = tempobj;
        }
      }
    }
   // console.log('inside after', tmparr);
   // console.log('inside sch after', schedulearr);
  }

  prepareScheduleforSaving(schedule_arr) {
    const timebase: any = [];
    for (let i = 0; i < schedule_arr.length; i++ ) {
      const timeindx = schedule_arr[i]['sTime'].replace(/\s+/, '') + schedule_arr[i]['eTime'].replace(/\s+/, '');
      // console.log('indx', timeindx);
      if (timebase[timeindx] === undefined) {
        timebase[timeindx] = new Array();
        timebase[timeindx].push(schedule_arr[i]);
      } else {
        timebase[timeindx].push(schedule_arr[i]);
      }
    }
    for (const obj in timebase) {
      if (obj) {
        // console.log('obj', obj);
        const len = timebase[obj].length;
        for (let i = 0; i < len; i++) {
          for (let j = i + 1 ; j < len; j++) {
            if (timebase[obj][j].day < timebase[obj][i].day) {
              const tempobj = timebase[obj][i];
              timebase[obj][i] = timebase[obj][j];
              timebase[obj][j] = tempobj;
            }
          }
        }
      }
    }
    // console.log('timebase', timebase);
    const displaysch = [];
    for (const obj in timebase) {
      if (obj) {
       // let curstr = '';
       const curstr = [];
        for (let i = 0; i < timebase[obj].length; i++) {
          // if (curstr !== '') {
          //   curstr += ',';
          // }
          // curstr += timebase[obj][i].day;
          curstr.push(timebase[obj][i].day);
        }
        displaysch.push({'stime': timebase[obj][0]['sTime'], 'etime': timebase[obj][0]['eTime'], 'daystr': curstr});
        // console.log('curstr', curstr);
      }
    }
    // console.log('timebase', timebase);
    // console.log('displaystr', displaysch);
    return displaysch;
  }

  setBusinessDetailsforHeaderDisp(bname, sector, logo) {
    const buss_det = {'bn': '', 'bs': '', 'logo': '' };
    const exist_det = this.getitemfromLocalStorage('ynwbp');
    if (exist_det) {
      buss_det.bn = bname || '';
      buss_det.bs = sector || '';
      buss_det.logo =  (logo !== '') ? logo : exist_det['logo'];
    } else {
      buss_det.bn = bname;
      buss_det.bs = sector;
      buss_det.logo = logo;
    }
    this.setitemonLocalStorage('ynwbp', buss_det);
    const pdata = { 'test': 'this is a test' };
    this.sendMessage(pdata);
  }

  sendMessage(message: any) {
    this.subject.next(message);
  }

clearMessage() {
    this.subject.next();
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
  const snackBarRef = this.snackBar.open(message, '', {duration: projectConstants.TIMEOUT_DELAY_LARGE, panelClass: panelclass });
  // const snackBarRef = this.snackBar.open(message, '', {duration: 100000, panelClass: panelclass });
  return snackBarRef;
}

redirectto (mod) {
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
  }
}

convertMinutesToHourMinute(mins) {
  let rethr = '';
  let retmin = '';
  if (mins > 0) {
    const hr = Math.floor(mins / 60);
    const min = Math.floor ( mins % 60);

    if (hr > 0) {
      if (hr > 1) {
        rethr = hr + ' hours';
      } else {
        rethr = hr + ' hour';
      }
    }
    if (min > 0) {
      if (min > 1) {
        retmin = ' ' + min + ' minute';
      } else {
        retmin = ' ' + min + ' minutes';
      }
    }
  } else {
    retmin = '' + 0 + ' minutes';
  }
  return rethr + retmin;
}

getdaysdifffromDates(date1, date2) {
  let firstdate;
  let seconddate;
  if (date1 === 'now') {
    firstdate =  new Date();
  } else {
    firstdate =  new Date(date1);
  }
  seconddate = new Date(date2);
  const timediff = Math.abs(firstdate.getTime() - seconddate.getTime());
  const hours = Math.abs(firstdate.getTime() - seconddate.getTime()) / 36e5; // 36e5 is the scientific notation for 60*60*1000
  return {'hours' : hours};
}

Lbase64Encode(str) {
  let retstr = '';
  /* // retstr = str.replace(/'/g, '~');
  retstr = encodeURI(str);
  if (str !== '' && str !== undefined) {
    retstr = atob(retstr);
  }
  return retstr; */
  // return str;
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
   /*if (str !== '' && str !== undefined) {
    // retstr = btoa(str);
    retstr = btoa(str);
    // retstr = retstr.replace(/~/g, '\'');
    retstr = decodeURI(retstr);
  }
   return retstr;*/
 // return str;
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
  const darr =  psdate.split('-');
  if (params['rettype'] === 'monthname') {
    darr[1] = monthNames[darr[1]];
  }
  return  darr[1] + ' ' + darr[2];
}
addZero(i) {
  if (i < 10) {
      i = '0' + i;
  }
  return i;
}

}
