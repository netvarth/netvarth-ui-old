import {Component, OnInit} from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';

import {HeaderComponent} from '../../../shared/modules/header/header.component';
import { AddProviderSchedulesComponent } from '../add-provider-schedule/add-provider-schedule.component';
import { GoogleMapComponent } from '../googlemap/googlemap.component';

import { SharedFunctions } from '../../../shared/functions/shared-functions';
import { SharedServices } from '../../../shared/services/shared-services';
import { ProviderServices } from '../../services/provider-services.service';
import { FormMessageDisplayService } from '../../../shared/modules/form-message-display/form-message-display.service';
import { projectConstants } from '../../../shared/constants/project-constants';


@Component({
    selector: 'app-provider-bwizard',
    templateUrl: './provider-bwizard.component.html'
})

export class ProviderbWizardComponent implements OnInit {
  amForm: FormGroup;
  userdet: any = [];
  active_step: number;
  wizard_data_holder: any = [];
  loc_list: any = [];
  schedule_arr: any = [];
  schedule_json: any = [];
  display_schedule: any = [];
  schedule_alreadyexists_for_location = false;
  ischange_schedule_clicked = false;
  loading_active = true;
  search_status = 0;
  coord_error = '';
  locname_error = '';
  gurl_error = '';
  error_Exists = false;
  constructor(
    private fb: FormBuilder,
    public shared_functions: SharedFunctions,
    public provider_services: ProviderServices,
    private dialog: MatDialog,
    private routerobj: Router
  ) {}

  ngOnInit() {
    this.wizard_data_holder = {
                                'name': '',
                                'summary': '',
                                'lat': '',
                                'lon': '',
                                'address': '',
                                'searchstatus': false,
                                'accountstatus': ''
                              };
    this.schedule_arr = projectConstants.BASE_SCHEDULE; // get base schedule from constants file
    this.display_schedule =  this.shared_functions.arrageScheduleforDisplay(this.schedule_arr);
    this.getUserdetails();
    this.getBusinessProfile();
    this.active_step = 0;

    localStorage.removeItem('new_provider');
  }

  getUserdetails() {
    this.userdet = this.shared_functions.getitemfromLocalStorage('ynw-user');
  }

  showStep(changetostep) {
    this.loading_active = true;
    this.resetErrors();
    if (changetostep === 2) {
      this.ischange_schedule_clicked = false;
    } else if (changetostep === 4) {
      this.getSearchstatus();
    }

    const curstep = this.active_step; // taking the current step number to a local variable
    this.save_setDetails(curstep, changetostep);
  }

  save_setDetails(stepid, changetostep) {
    switch (stepid) {
      case 0:
        this.active_step = changetostep;
        this.loading_active = false;
      break;
      case 1:
        const post_itemdata1 = {
            'businessName': this.wizard_data_holder.name || '' ,
            'businessDesc': this.wizard_data_holder.summary || ''
        };

        // adding the basic data to the submit_data
        /* const blob_itemdata1 = new Blob([JSON.stringify(post_itemdata1)], { type: 'application/json' });
        const submit_data1: FormData = new FormData();
        submit_data1.append('data', blob_itemdata1);*/
        // this.provider_services.createPrimaryFields(submit_data1)
        this.provider_services.patchbProfile(post_itemdata1)
          .subscribe(
            data => {
              this.setBprofile_to_object(data);
              this.active_step = this.wizardPageShowDecision(this.active_step, changetostep);
              this.loading_active = false;
              // calling function which saves the business related details to show in the header
              this.shared_functions.setBusinessDetailsforHeaderDisp(data['businessName'] || '', data['serviceSector']['displayName'], '');
            },
            error => {
              this.loading_active = false;
            }
          );
      break;
      case 2:
          let latlon_Exists = false;
          const blankpattern = new RegExp(projectConstants.VALIDATOR_BLANK);
          const floatpattern = new RegExp(projectConstants.VALIDATOR_FLOAT);
          const urlpattern = new RegExp(projectConstants.VALIDATOR_URL);
          let latexists = false;
          let lonexists = false;
          // validating the fields if they are entered
          if (this.wizard_data_holder.lon !== '' && this.wizard_data_holder.lon !== undefined) {
            latlon_Exists = true;
            const lon_validate = floatpattern.test(this.wizard_data_holder.lon);
            latexists = true;
            if (!lon_validate) {
              this.error_Exists = true;
              this.coord_error = 'Only number are allowed for GPS Coordinate';
            }
          }
          if (this.wizard_data_holder.lat !== '' && this.wizard_data_holder.lat !== undefined) {
            latlon_Exists = true;
            lonexists = true;
            const lat_validate = floatpattern.test(this.wizard_data_holder.lat);
            if (!lat_validate) {
              this.error_Exists = true;
              this.coord_error = 'Only number are allowed for GPS Coordinate';
            }
          }
          if (latlon_Exists) { // if lat or lan or both exist, then the location name is required
            if (!latexists || !lonexists) {
              this.error_Exists = true;
              this.coord_error = 'Both coordinates are required';
            }
            const locname_validate = blankpattern.test(this.wizard_data_holder.location);
            if (locname_validate) {
              this.error_Exists = true;
              this.locname_error = 'Please enter the location name';
            }
            const mapurlexists_validate = blankpattern.test(this.wizard_data_holder.mapurl);
            if (!mapurlexists_validate) {
              const mapurl_validate = urlpattern.test(this.wizard_data_holder.mapurl);
              if (!mapurl_validate) {
                this.error_Exists = true;
                this.gurl_error = 'Invalid Google map URL';
              }
            }
          }
          if (this.error_Exists === true) {
            this.loading_active = false;
            return;
          }
        const post_itemdata2 = {
           'baseLocation': {
                              'place': this.wizard_data_holder.location || '',
                              'longitude': this.wizard_data_holder.lon || '',
                              'lattitude': this.wizard_data_holder.lat || '',
                              'googleMapUrl': this.wizard_data_holder.mapurl || '',
                             // 'pinCode': this.wizard_data_holder.pincode || '',
                              'address': this.wizard_data_holder.address || '',
                              'bSchedule': {
                                   'timespec': {}
                                }
                              }
          };

          // Check whether atleast one schedule is added. If not setting the base schedule from constants to save it as the schedule for base location
          if (this.schedule_arr.length === 0) {
            this.schedule_arr = projectConstants.BASE_SCHEDULE;
          }

          // Preparing the respective json variable with the schedule details
          this.schedule_json = [];
          const cdate2 = new Date();
          const mon2 = (cdate2.getMonth() + 1);
          let month2 = '';
          if (mon2 < 10) {
            month2 = '0' + mon2;
          }
          const today2 = cdate2.getFullYear() + '-' + month2 + '-' + cdate2.getDate();
          const save_schedule2 = this.shared_functions.prepareScheduleforSaving(this.schedule_arr);
          for (const schedule of save_schedule2) {
            this.schedule_json.push({
              'recurringType': 'Weekly',
              'repeatIntervals': schedule.daystr,
              'startDate': today2,
              'terminator': {
                'endDate': '',
                'noOfOccurance': ''
              },
              'timeSlots': [{
                'sTime': schedule.stime,
                'eTime': schedule.etime
              }]
            });
          }
          // assiging the schedule json to the object to save it
          post_itemdata2.baseLocation.bSchedule.timespec = this.schedule_json;

          this.provider_services.patchbProfile(post_itemdata2)
            .subscribe(
              data => {
                this.setBprofile_to_object(data);
                this.active_step = this.wizardPageShowDecision(this.active_step, changetostep);
                this.loading_active = false;
              },
              error => {
                this.loading_active = false;
              }
            );
      break;
      case 3:
        let post_itemdata3;
      // Check whether atleast one schedule is added
      if (this.schedule_arr.length === 0) {
        this.schedule_json = [];
      } else {
        this.schedule_json = [];
        const cdate = new Date();
        const mon = (cdate.getMonth() + 1);
        let month = '';
        if (mon < 10) {
          month = '0' + mon;
        }
        const today = cdate.getFullYear() + '-' + month + '-' + cdate.getDate();
        const save_schedule = this.shared_functions.prepareScheduleforSaving(this.schedule_arr);
        for (const schedule of save_schedule) {
          this.schedule_json.push({
            'recurringType': 'Weekly',
            'repeatIntervals': schedule.daystr,
            'startDate': today,
            'terminator': {
              'endDate': '',
              'noOfOccurance': ''
            },
            'timeSlots': [{
              'sTime': schedule.stime,
              'eTime': schedule.etime
            }]
          });
        }
      }

      post_itemdata3 = {
        'baseLocation': {
          'id' : this.wizard_data_holder.locid,
          'bSchedule': {
          'timespec': this.schedule_json
          }
        }
      };
      console.log('schedule save', post_itemdata3);
      // adding the schedule for the location
      /* const blob_itemdata3 = new Blob([JSON.stringify(post_itemdata3)], { type: 'application/json' });
      const submit_data3: FormData = new FormData();
      submit_data3.append('data', blob_itemdata3);*/
      // this.provider_services.createPrimaryFields(submit_data3)
      this.provider_services.patchbProfile(post_itemdata3)
        .subscribe(
          data => {
            this.setBprofile_to_object(data);
            this.active_step = this.wizardPageShowDecision(this.active_step, changetostep);
            this.loading_active = false;
          },
          error => {
            this.active_step = this.wizardPageShowDecision(this.active_step, changetostep);
            this.loading_active = false;
          }
        );
      break;
      case 4:
        this.active_step = this.wizardPageShowDecision(this.active_step, changetostep);
        this.loading_active = false;
      break;
      case 5:
        this.active_step = this.wizardPageShowDecision(this.active_step, changetostep);
        this.loading_active = false;
      break;
    }
  }

  wizardPageShowDecision(curstep, changetostep) {
   // console.log('curpage', curstep);
    let changerequired = false;
    let changeid = -1;
    if (curstep === 2 && changetostep === 3) { // from location to schedule
      // check whether the is sufficient location details to show the schedule
      if (this.wizard_data_holder.lat === '' || this.wizard_data_holder.lon  === '' || this.wizard_data_holder.location === '' ) {
        // case if sufficient info is not there to show the schedule page, so navigate user to the no sufficient page
        changerequired = true;
        changeid = 5;
      }
    } else  if (curstep === 3 && changetostep === 4) { // from schedule to search
      if (this.wizard_data_holder.lat === '' || this.wizard_data_holder.lon  === '' || this.wizard_data_holder.location === '' ||
          this.wizard_data_holder.name === '' ) {
        changerequired = true;
        changeid = 5;
      }
    } else if (curstep === 5 && changetostep === 4) { // from missing data to search
      this.loading_active = true;
      if (this.wizard_data_holder.name === '') { // if business name is blank, then take user to step 1
        changerequired = true;
        changeid = 1;
      } else if (this.wizard_data_holder.lat === '' || this.wizard_data_holder.lon  === '' || this.wizard_data_holder.location === '') {
        // if location basic details are missing, then take user to step 2
        changerequired = true;
        changeid = 2;
      } else if (this.schedule_arr.length === 0) { // if schedule details are missing, take user to step 3
        changerequired = true;
        changeid = 3;
      }
      this.loading_active = false;
    }
    if (changerequired) {
      return changeid;
    } else {
      return changetostep;
    }

  }

  getBusinessProfile() {
    this.provider_services.getBussinessProfile()
      .subscribe (data => {
        this.setBprofile_to_object(data);
        this.loading_active = false;
      });
  }

  setBprofile_to_object(obj) {
    this.wizard_data_holder = {
      'name': obj.businessName || '',
      'summary': obj.businessDesc || '',
      'accountstatus': obj.status || ''
    };

    if (obj.baseLocation) {
        this.wizard_data_holder.locid = obj.baseLocation.id || '';
        this.wizard_data_holder.lat =  obj.baseLocation.lattitude || '';
        this.wizard_data_holder.lon =  obj.baseLocation.longitude || '';
        this.wizard_data_holder.address = obj.baseLocation.address || '';
        // this.wizard_data_holder.pincode =  obj.baseLocation.pinCode || '';
        this.wizard_data_holder.location = obj.baseLocation.place || '';
        this.wizard_data_holder.mapurl =  obj.baseLocation.googleMapUrl || '';

        if (obj.baseLocation.bSchedule.timespec) {
          if (obj.baseLocation.bSchedule.timespec.length > 0) {
            this.schedule_arr = [];
          }
          // extracting the schedule intervals
          for (let i = 0; i < obj.baseLocation.bSchedule.timespec.length; i++) {
            for (let j = 0; j < obj.baseLocation.bSchedule.timespec[i].repeatIntervals.length; j++) {
              // pushing the schedule details to the respective array to show it in the page
              this.schedule_arr.push({
                day: obj.baseLocation.bSchedule.timespec[i].repeatIntervals[j],
                sTime: obj.baseLocation.bSchedule.timespec[i].timeSlots[0].sTime,
                eTime: obj.baseLocation.bSchedule.timespec[i].timeSlots[0].eTime
              });
            }
          }
        }
      }
      this.display_schedule = [];
      this.display_schedule =  this.shared_functions.arrageScheduleforDisplay(this.schedule_arr);
   }

  changeSchedule_clicked() {
    this.ischange_schedule_clicked = true;
  }

  // Save schedule to arr
  handlesSaveschedule(obj) {
    console.log('returned Schedule', obj);
    this.schedule_arr = obj;
    this.display_schedule =  this.shared_functions.arrageScheduleforDisplay(this.schedule_arr);
    // this.ischange_schedule_clicked = false;
  }
  handleCancelschedule(obj) {
    this.handlesSaveschedule(obj);
    this.ischange_schedule_clicked = false;
  }

  getDay(num) {
    return projectConstants.myweekdaysSchedule[num];
  }

  showGooglemap() {
    const dialogRef = this.dialog.open(GoogleMapComponent, {
      width: '50%',
      panelClass: 'googlemainmappopup',
      data: {
        type : 'add',
        passloc: {'lat': this.wizard_data_holder['lat'], 'lon': this.wizard_data_holder['lon']}
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (result['status'] === 'selectedonmap') {
          if (result['map_point'].latitude) {
          const mapurl = projectConstants.MAP_BASE_URL + result['map_point'].latitude + ',' + result['map_point'].longitude + '/@' + result['map_point'].latitude + ',' + result['map_point'].longitude + ',15z';

          this.wizard_data_holder['lat'] = result['map_point'].latitude || null;
          this.wizard_data_holder['lon'] = result['map_point'].longitude || null;
          this.wizard_data_holder['address'] = result['address'] || null;
         // this.wizard_data_holder['pincode'] = result['pincode'] || null;
          this.wizard_data_holder['mapurl'] = mapurl || null;
        }
      }
    }
    });
  }

  getSearchstatus() {
    this.provider_services.getPublicSearch()
      .subscribe(data => {
        if (data) {
          this.wizard_data_holder['searchstatus'] = 1;
          this.search_status = 1;
        } else {
          this.wizard_data_holder['searchstatus'] = 2;
          this.search_status = 2;
        }
      });

  }

  handle_searchstatus(status) {
    this.provider_services.updatePublicSearch(status)
      .subscribe (data => {
          if (status === 'ENABLE') {
            this.wizard_data_holder['searchstatus'] = 1;
            this.search_status = 1;
          } else if (status === 'DISABLE') {
            this.wizard_data_holder['searchstatus'] = 2;
            this.search_status = 2;
          }
      });
  }

  redirecttoProfile() {
   this.routerobj.navigate(['provider', 'settings', 'bprofile-search']);
  }

  checkClose() {
    const redirect = false;
    let show_incomplete = false;
    const bname = (this.wizard_data_holder.name) ? this.wizard_data_holder.name.trim() : '';
    const lat = (this.wizard_data_holder.lat) ? this.wizard_data_holder.lat.trim() : '';
    const lon = (this.wizard_data_holder.lon)  ? this.wizard_data_holder.lon.trim() : '';
    const lname = (this.wizard_data_holder.location) ? this.wizard_data_holder.location.trim() : '';
    const sch = this.schedule_arr.length;
    if (bname === '')  {
      show_incomplete = true;
    }
    if (lat === '')  {
      show_incomplete = true;
    }
    if (lon === '')  {
      show_incomplete = true;
    }
    if (lname === '')  {
      show_incomplete = true;
    }
    if (sch === 0 || sch === '') {
      show_incomplete = true;
    }
    if (show_incomplete) { // if incomplete data is there then show the incomplete page
      this.active_step = 5;
    } else { // if sufficient data is there, then show the bprofile
      this.redirecttoProfile();
    }
  }
  resetErrors() {
    this.error_Exists = false;
    this.coord_error = '';
    this.locname_error = '';
    this.gurl_error = '';
  }
}
