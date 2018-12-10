import { Component, Inject, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FormMessageDisplayService } from '../../../shared//modules/form-message-display/form-message-display.service';
import { ProviderDataStorageService } from '../../services/provider-datastorage.service';
import { ProviderServices } from '../../services/provider-services.service';
import { projectConstants } from '../../../shared/constants/project-constants';
import { AddProviderSchedulesComponent } from '../add-provider-schedule/add-provider-schedule.component';
import { GoogleMapComponent } from '../googlemap/googlemap.component';
import { SharedFunctions } from '../../../shared/functions/shared-functions';
import { Messages } from '../../../shared/constants/project-messages';

@Component({
  selector: 'app-provider-add-locations',
  templateUrl: './add-provider-waitlist-locations.component.html',
  styleUrls: ['./add-provider-waitlist-locations.component.css']
})
export class AddProviderWaitlistLocationsComponent implements OnInit {
  @ViewChild('loc') private elementRef: ElementRef;

  select_cap = Messages.PAY_SET_SELECT_CAP;
  location_cap = Messages.LOCATION_CAP;
  amenities_cap = Messages.AMENITIES_CAP;
  location_map_cap = Messages.LOCATION_MAP_CAP;
  location_map_message = Messages.LOCATION_MAP_MESSAGE_CAP;
  location_name = Messages.LOCATION_NAME_CAP;
  latitude_cap = Messages.LATITUDE_CAP;
  longitude_cap = Messages.LONGITUDE_CAP;
  address_cap = Messages.LOCATION_ADDRESS_CAP;
  map_url_cap = Messages.MAP_URL_CAP;
  schedule_cap = Messages.SCHEULDE_CAP;
  open_cap = Messages.OPEN_CAP;
  parking_type_cap = Messages.PARKING_TYPE_CAP;
  cancel_btn = Messages.CANCEL_BTN;
  save_btn = Messages.SAVE_BTN;
  amForm: FormGroup;
  api_error = null;
  api_success = null;
  schedule_arr: any = [];
  schedule_json: any = [];
  general_scheduleholder: any = [];
  general_schedule: any = [];
  bProfile: any = [];
  parking_list: any = [];
  schedule_alreadyexists_for_location = false;
  loc_badges: any = [];
  sel_badges: any = [];
  checked_sel_badges = false;
  data_source = 'location';
  forbadge = false;
  proceedwithschedule = false;
  parking_types = projectConstants.PARKING_TYPES;

  constructor(
    public dialogRef: MatDialogRef<AddProviderWaitlistLocationsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    public fed_service: FormMessageDisplayService,
    public provider_services: ProviderServices,
    private provider_datastorageobj: ProviderDataStorageService,
    private sharedfunctionobj: SharedFunctions,
    private dialog: MatDialog
  ) {
    // console.log('received data', data);
    this.data_source = data.source;
    this.loc_badges = data.badges;
    if (data.type === 'edit') {
      this.forbadge = data.forbadge;
      if (data.location.locationVirtualFields) {
        for (const curbadge in data.location.locationVirtualFields) {
          if (curbadge) {
            this.sel_badges.push(curbadge);
          }
        }
      }
    }
    this.checked_sel_badges = true;
  }

  ngOnInit() {
    this.bProfile = this.provider_datastorageobj.get('bProfile');
    // Get the parking types
    // this.getParkingtypes();
    // get location badges
    // this.getLocationBadges();
    // if (this.data_source !== 'bprofile') {
    // this.schedule_arr = projectConstants.BASE_SCHEDULE; // get base schedule from constants file
    // }
    if (this.data_source === 'bprofile') {
      console.log('i am here', this.data_source);
      // this.schedule_arr = projectConstants.BASE_SCHEDULE; // get base schedule from constants file
      this.getgeneralBusinessSchedules();
    } else {
      this.proceedwithschedule = true;
    }

    this.createForm();
    this.elementRef.nativeElement.focus();
  }
  getgeneralBusinessSchedules() {
    this.provider_services.getgeneralBusinessSchedules()
      .subscribe(data => {
        this.general_scheduleholder = data;
        this.general_schedule = [];
        for (let j = 0; j < this.general_scheduleholder.length; j++) {
          const obt_sch = this.general_scheduleholder[j];
          // console.log('business', obt_sch[0].repeatIntervals);
          for (let k = 0; k < obt_sch.repeatIntervals.length; k++) {
            // pushing the schedule details to the respective array to show it in the page
            for (let l = 0; l < obt_sch.timeSlots.length; l++) {
              this.general_schedule.push({
                day: obt_sch.repeatIntervals[k],
                sTime: obt_sch.timeSlots[l].sTime,
                eTime: obt_sch.timeSlots[l].eTime
              });
            }
          }
        }
        if (this.general_schedule.length > 0) {
          this.schedule_arr = this.general_schedule;
        } else {
          this.schedule_arr = projectConstants.BASE_SCHEDULE; // get base schedule from constants file
        }
        this.proceedwithschedule = true;
        // console.log('genschedule', this.general_schedule);
        // console.log('arranged Schedule', this.shared_functions.arrageScheduleforDisplay(this.general_schedule));
      },
        error => {

        });
  }
  createForm() {
    if (this.data.type === 'add') {
      this.amForm = this.fb.group({
        locname: ['', Validators.compose([Validators.required, Validators.pattern(projectConstants.VALIDATOR_BLANK_FALSE)])],
        locaddress: ['', Validators.compose([Validators.required, Validators.maxLength(200)])],
        loclattitude: ['', Validators.compose([Validators.required, Validators.pattern(projectConstants.VALIDATOR_FLOAT)])],
        loclongitude: ['', Validators.compose([Validators.required, Validators.pattern(projectConstants.VALIDATOR_FLOAT)])],
        locmapurl: [{ value: '', disabled: true }],
        /* locparkingtype: [''],*/
        /* locpincode: [''] ,
         loct24hour: ['']*/
      });
    } else {
      if (this.forbadge === true) {
        this.amForm = this.fb.group({
          locparkingtype: [''],
          loct24hour: ['']
        });
      } else {
        this.amForm = this.fb.group({
          locname: ['', Validators.compose([Validators.required, Validators.pattern(projectConstants.VALIDATOR_BLANK_FALSE)])],
          locaddress: ['', Validators.compose([Validators.required, Validators.maxLength(200)])],
          loclattitude: ['', Validators.compose([Validators.required, Validators.pattern(projectConstants.VALIDATOR_FLOAT)])],
          loclongitude: ['', Validators.compose([Validators.required, Validators.pattern(projectConstants.VALIDATOR_FLOAT)])],
          locmapurl: [{ value: '', disabled: true }]/*,
          locpincode: ['']*/
        });
      }
    }


    if (this.data.type === 'edit') {
      this.updateForm();
    }
  }
  updateForm() {
    if (this.forbadge === true) { // case if coming for add / edit badges
      this.amForm.setValue({
        locparkingtype: this.data.location.parkingType || 'none',
        loct24hour: this.data.location.open24hours || null,
      });
    } else {
      this.amForm.setValue({
        // locstatus: this.data.location.status || null,
        locname: this.data.location.place || null,
        locaddress: this.data.location.address || null,
        loclattitude: this.data.location.lattitude || null,
        loclongitude: this.data.location.longitude || null,
        locmapurl: this.data.location.googleMapUrl || null/*,
        locpincode: this.data.location.pinCode || null,*/
      });
      this.schedule_arr = [];
      // extracting the schedule intervals
      if (this.data.location.bSchedule.timespec) {
        for (let i = 0; i < this.data.location.bSchedule.timespec.length; i++) {
          for (let j = 0; j < this.data.location.bSchedule.timespec[i].repeatIntervals.length; j++) {
            // pushing the schedule details to the respective array to show it in the page
            this.schedule_arr.push({
              day: this.data.location.bSchedule.timespec[i].repeatIntervals[j],
              sTime: this.data.location.bSchedule.timespec[i].timeSlots[0].sTime,
              eTime: this.data.location.bSchedule.timespec[i].timeSlots[0].eTime
            });
          }
        }
      }
      if (this.data.source !== 'bprofile') {
        if (this.schedule_arr.length > 0) {
          this.schedule_arr = [];
          this.schedule_alreadyexists_for_location = true; // this field decided whether schedule already exists for the location being edited
        } else {
          if (this.data.type !== 'edit') {
            this.schedule_arr = projectConstants.BASE_SCHEDULE;
          }
        }
      }
    }
  }

  // gets the parking types
  // getParkingtypes() {
  //   this.provider_services.getParkingtypes()
  //     .subscribe(data => {
  //       this.parking_list = data;
  //     });
  // }

  // Save schedule to arr
  handlesSaveschedule(obj) {
    this.schedule_arr = obj;
  }

  // this method is used to save the location details, if the save is being done from the bprofile page
  savelocation_fromWaitlistmanager(form_data) {

    let post_itemdata2;
    if (this.schedule_alreadyexists_for_location === false) {
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
        const save_schedule = this.sharedfunctionobj.prepareScheduleforSaving(this.schedule_arr);
        // console.log('sch for save', save_schedule);

        for (const schedule of save_schedule) {
          // const savstr = schedule.daystr.split(',');
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
    }

    if (this.forbadge === true) {
      post_itemdata2 = {
        'open24hours': (form_data.loct24hour) ? true : false
      };
      if (form_data.locparkingtype) {
        post_itemdata2.parkingType = form_data.locparkingtype;
      }
      post_itemdata2.locationVirtualFields = {};
      if (this.sel_badges.length > 0) {
        for (let i = 0; i < this.sel_badges.length; i++) {
          post_itemdata2.locationVirtualFields[this.sel_badges[i]] = true;
        }
      }
    } else {

      const curlabel = form_data.locname;
      const pattern2 = new RegExp(projectConstants.VALIDATOR_BLANK);
      const result2 = pattern2.test(curlabel);
      if (result2) {
        this.api_error = this.sharedfunctionobj.getProjectMesssages('BPROFILE_LOCNAME_BLANK'); // 'Phone label should not be blank';
        return;
      }
      form_data.locmapurl = this.amForm.controls['locmapurl'].value;
      post_itemdata2 = {
        'place': form_data.locname || '',
        'longitude': form_data.loclongitude || '',
        'lattitude': form_data.loclattitude || '',
        'googleMapUrl': form_data.locmapurl || '',
        // 'pinCode': form_data.locpincode || '',
        'address': form_data.locaddress || ''
      };
      if (this.schedule_json.length > 0) {
        post_itemdata2.bSchedule = {};
        post_itemdata2.bSchedule.timespec = this.schedule_json;
      }
    }
    // console.log('submitted loc', JSON.stringify(post_itemdata2));
    if (this.data.location && this.data.location.id) {
      post_itemdata2.id = this.data.location.id;
      this.provider_services.editProviderLocation(post_itemdata2)
        .subscribe(
          data => {
            if (this.forbadge === true) {
              this.api_success = this.sharedfunctionobj.getProjectMesssages('WAITLIST_LOCATION_AMINITIES_SAVED');
            } else {
              this.api_success = this.sharedfunctionobj.getProjectMesssages('WAITLIST_LOCATION_UPDATED');
            }
            setTimeout(() => {
              this.dialogRef.close('reloadlist');
            }, projectConstants.TIMEOUT_DELAY);
          },
          error => {
            this.api_error = this.sharedfunctionobj.getProjectErrorMesssages(error);
          }
        );
    } else {
      // console.log('submitted loc', JSON.stringify(post_data));
      this.provider_services.addProviderLocation(post_itemdata2)
        .subscribe(
          data => {
            this.api_success = this.sharedfunctionobj.getProjectMesssages('WAITLIST_LOCATION_CREATED');
            setTimeout(() => {
              this.dialogRef.close('reloadlist');
            }, projectConstants.TIMEOUT_DELAY);
          },
          error => {
            this.api_error = this.sharedfunctionobj.getProjectErrorMesssages(error);
          }
        );
    }
  }
  // this method is used to save the location details, if the save is being done from the bprofile page
  savelocation_fromBprofile(form_data) {

    let post_itemdata2;
    if (this.schedule_alreadyexists_for_location === false) {
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
        const save_schedule = this.sharedfunctionobj.prepareScheduleforSaving(this.schedule_arr);
        // for (const schedule of this.schedule_arr) {
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
    }

    if (this.forbadge === true) {
      post_itemdata2 = {
        'baseLocation': {
          'open24hours': (form_data.loct24hour) ? true : false
        }
      };
      if (form_data.locparkingtype) {
        post_itemdata2.baseLocation.parkingType = form_data.locparkingtype;
      }
      post_itemdata2.baseLocation.locationVirtualFields = {};
      if (this.sel_badges.length > 0) {
        for (let i = 0; i < this.sel_badges.length; i++) {
          post_itemdata2.baseLocation.locationVirtualFields[this.sel_badges[i]] = true;
        }
      }
    } else {
      const curlabel = form_data.locname;
      const pattern2 = new RegExp(projectConstants.VALIDATOR_BLANK);
      const result2 = pattern2.test(curlabel);
      if (result2) {
        this.api_error = this.sharedfunctionobj.getProjectMesssages('BPROFILE_LOCNAME_BLANK'); // 'Phone label should not be blank';
        return;
      }
      form_data.locmapurl = this.amForm.controls['locmapurl'].value;
      post_itemdata2 = {
        'baseLocation': {
          'place': form_data.locname || '',
          'longitude': form_data.loclongitude || '',
          'lattitude': form_data.loclattitude || '',
          'googleMapUrl': form_data.locmapurl || '',
          // 'pinCode': form_data.locpincode || '',
          'address': form_data.locaddress || ''
        }
      };
      if (this.schedule_json.length > 0) {
        post_itemdata2.baseLocation.bSchedule = {};
        post_itemdata2.baseLocation.bSchedule.timespec = this.schedule_json;
      }
    }
    if (this.data.location && this.data.location.id) {
      post_itemdata2.baseLocation.id = this.data.location.id;
    }

    // console.log('submited', post_itemdata2);
    this.provider_services.patchbProfile(post_itemdata2)
      .subscribe(
        data => {
          if (this.forbadge === true) {
            this.api_success = this.sharedfunctionobj.getProjectMesssages('WAITLIST_LOCATION_AMINITIES_SAVED');
          } else {
            this.api_success = (this.data.type === 'add') ? this.sharedfunctionobj.getProjectMesssages('WAITLIST_LOCATION_CREATED') : this.sharedfunctionobj.getProjectMesssages('WAITLIST_LOCATION_UPDATED');
          }
          setTimeout(() => {
            this.dialogRef.close('reloadlist');
          }, projectConstants.TIMEOUT_DELAY);
        },
        error => {
          // this.loading_active = false;
        }
      );
  }

  onSubmit(form_data) {
    // let post_data;
    if (this.data_source === 'bprofile') {
      this.savelocation_fromBprofile(form_data);
    } else {
      this.savelocation_fromWaitlistmanager(form_data);
    }
  }

  // Created new provider location
  addProviderLocation(post_data) {
    this.provider_services.addProviderLocation(post_data)
      .subscribe(
        data => {
          this.api_success = this.sharedfunctionobj.getProjectMesssages('WAITLIST_LOCATION_CREATED');
          setTimeout(() => {
            this.dialogRef.close('reloadlist');
          }, projectConstants.TIMEOUT_DELAY);
        },
        error => {
          this.api_error = this.sharedfunctionobj.getProjectErrorMesssages(error);
        }
      );
  }
  editProviderLocation(post_data) {
    post_data.id = this.data.location.id;
    if (this.sel_badges.length > 0) {
      post_data.locationVirtualFields = {};
      for (let i = 0; i < this.sel_badges.length; i++) {
        post_data.locationVirtualFields[this.sel_badges[i]] = true;
      }
    }
    // console.log('submitted loc', JSON.stringify(post_data));
    this.provider_services.editProviderLocation(post_data)
      .subscribe(
        data => {
          this.api_success = this.sharedfunctionobj.getProjectMesssages('WAITLIST_LOCATION_UPDATED');
          setTimeout(() => {
            this.dialogRef.close('reloadlist');
          }, projectConstants.TIMEOUT_DELAY);
        },
        error => {
          this.api_error = this.sharedfunctionobj.getProjectErrorMesssages(error);
        }
      );
  }

  getBusinessProfile() {

    this.provider_services.getBussinessProfile()
      .subscribe(
        data => {
          this.bProfile = data;
          this.provider_datastorageobj.set('bProfile', data);
        },
        error => {

        }
      );

  }
  handle_badge_click(obj) {
    const indx = this.sel_badges.indexOf(obj.name);
    if (indx !== -1) {
      this.sel_badges.splice(indx, 1);
    } else {
      this.sel_badges.push(obj.name);
    }
  }
  checkbadgealreadyselected(obj) {

    if (this.sel_badges.indexOf(obj.name) !== -1) {
      return true;
    }
  }

  showGooglemap() {
    this.resetApiErrors();
    const dialogRef = this.dialog.open(GoogleMapComponent, {
      width: '50%',
      panelClass: 'googlemainmappopup',
      disableClose: true,
      data: {
        type: 'add',
        passloc: { 'lat': this.GetControl(this.amForm, 'loclattitude').value, 'lon': this.GetControl(this.amForm, 'loclongitude').value }
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (result['status'] === 'selectedonmap') {
          if (result['map_point'].latitude) {
            const mapurl = projectConstants.MAP_BASE_URL + result['map_point'].latitude + ',' + result['map_point'].longitude + '/@' + result['map_point'].latitude + ',' + result['map_point'].longitude + ',15z';
            this.amForm.patchValue({
              loclattitude: result['map_point'].latitude || null,
              loclongitude: result['map_point'].longitude || null,
              locmapurl: mapurl || null
            });
          }
          this.amForm.patchValue({
            locaddress: result['address'] || null/*,
          locpincode: result['pincode'] || null*/
          });
        }
      }
    });
  }
  public GetControl(form: FormGroup, field: string) {
    const el = document.querySelector('input[name="' + field + '"]');
    return form.get(field);
  }

  getCoordinatesFromAddress() {
    this.resetApiErrors();
    const address = this.GetControl(this.amForm, 'locaddress').value || '';
    if (address !== '' && address !== null) {
      this.provider_services.getGoogleMapLocationGeometry(address)
        .subscribe(mapdata => {
          if (mapdata['status'] === 'OK') {
            if (mapdata['results'][0]['geometry']['location']) {
              const mapurl = projectConstants.MAP_BASE_URL + mapdata['results'][0]['geometry']['location']['lat'] + ',' + mapdata['results'][0]['geometry']['location']['lng'] + '/@' + mapdata['results'][0]['geometry']['location']['lat'] + ',' + mapdata['results'][0]['geometry']['location']['lng'] + ',15z';
              this.amForm.patchValue({
                loclattitude: mapdata['results'][0]['geometry']['location']['lat'] || null,
                loclongitude: mapdata['results'][0]['geometry']['location']['lng'] || null,
                locmapurl: mapurl || null
              });
            }
          } else {
            this.api_error = 'Sorry.. not able to get the map coordinates';
          }
        });
    }
  }
  checkAddressExists() {
    const address = this.GetControl(this.amForm, 'locaddress').value || '';
    const chkaddress = address.replace(/ /g, '');
    if (chkaddress.length >= 4) {
      return false;
    } else {
      return true;
    }
  }
  resetApiErrors() {
    this.api_error = null;
    this.api_success = null;
  }
}
