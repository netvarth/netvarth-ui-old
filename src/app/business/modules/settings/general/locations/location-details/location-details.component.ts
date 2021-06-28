import { Component, OnInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { Messages } from '../../../../../../shared/constants/project-messages';
import { ProviderServices } from '../../../../../../ynw_provider/services/provider-services.service';
import { SharedFunctions } from '../../../../../../shared/functions/shared-functions';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { ProviderSharedFuctions } from '../../../../../../ynw_provider/shared/functions/provider-shared-functions';
import { projectConstants } from '../../../../../../app.component';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { GoogleMapComponent } from '../../../../../../ynw_provider/components/googlemap/googlemap.component';
import { MatDialog } from '@angular/material/dialog';
import { Location } from '@angular/common';
import { FormMessageDisplayService } from '../../../../../../shared/modules/form-message-display/form-message-display.service';
import { AddProviderWaitlistLocationsComponent } from '../../../../../../ynw_provider/components/add-provider-waitlist-locations/add-provider-waitlist-locations.component';
import { projectConstantsLocal } from '../../../../../../shared/constants/project-constants';
import { GroupStorageService } from '../../../../../../shared/services/group-storage.service';
import { SnackbarService } from '../../../../../../shared/services/snackbar.service';
import { WordProcessor } from '../../../../../../shared/services/word-processor.service';
import { SharedServices } from '../../../../../../shared/services/shared-services';
import { ConfirmBoxComponent } from '../../../../../../shared/components/confirm-box/confirm-box.component';
import { JaldeeTimeService } from '../../../../../../shared/services/jaldee-time-service';

@Component({
  selector: 'app-location-details',
  templateUrl: './location-details.component.html',
  styleUrls: ['../../../../../../../assets/css/style.bundle.css', '../../../../../../../assets/plugins/custom/datatables/datatables.bundle.css', '../../../../../../../assets/plugins/global/plugins.bundle.css', '../../../../../../../assets/plugins/custom/prismjs/prismjs.bundle.css', '../../../../../../../assets/css/pages/wizard/wizard-1.css']

})

export class LocationDetailsComponent implements OnInit, OnDestroy {
  longitude_cap = Messages.BPROFILE_LONGITUDE_CAP;
  latitude_cap = Messages.BPROFILE_LATIITUDE_CAP;
  enable_cap = Messages.ENABLE_CAP;
  disable_cap = Messages.DISABLE_CAP;
  loc_amenities_cap = Messages.BPROFILE_LOCATION_AMENITIES;
  you_havent_cap = Messages.BPROFILE_HAVE_NOT_ADD_CAP;
  add_it_now_cap = Messages.BPROFILE_ADD_IT_NOW_CAP;
  service_winds_cap = Messages.SERVICE_TIME_CAP;
  serv_window_cap = Messages.SERV_TIME_WINDOW_CAP;
  status_cap = Messages.COUPONS_STATUS_CAP;
  base_loca_cap = Messages.WAITLIST_BASE_LOC_CAP;
  loc_status_cap = Messages.WAITLIST_LOC_STATUS_CAP;
  set_base_loc_cap = Messages.WAITLIST_SET_BASE_CAP;
  schedule_cap = Messages.WAITLIST_SCHEDULE_CAP;
  queue_cap = Messages.WAITLIST_QUEUE_CAP;
  waitlist_cap = Messages.WAITLIST_CAP;
  queues_cap = Messages.SERVICE_TIME_CAP;
  location_map_cap = Messages.LOCATION_MAP_CAP;
  location_map_message = Messages.LOCATION_MAP_MESSAGE_CAP;
  loc_placeholder = Messages.LOC_PLACEHOLDER;
  address_cap = Messages.LOCATION_ADDRESS_CAP;
  open_cap = Messages.OPEN_CAP;
  cancel_btn = Messages.CANCEL_BTN;
  save_btn = Messages.SAVE_BTN;
  map_url_cap = Messages.MAP_URL_CAP;
  loca_hours = Messages.LOCATION_HOURS_CAP;
  location_id = null;
  location_data;
  queues: any = [];
  mapurl;
  badgeIcons = {};
  api_loading = false;
  loc_badges: any = [];
  badge_map_arr: any = [];
  display_schedule: any = [];
  schedule_ar: any = [];
  parking_types = projectConstants.PARKING_TYPES;
  breadcrumbs_init = [
    {
      title: 'Settings',
      url: '/provider/settings'
    },
    {
      title: Messages.GENERALSETTINGS,
      url: '/provider/settings/general'
    },
    {
      title: 'Locations',
      url: '/provider/settings/general/locations'
    }
  ];
  breadcrumbs = this.breadcrumbs_init;
  editlocdialogRef;
  isCheckin;
  active_Schedules: any = [];
  action;
  amForm: FormGroup;
  locamForm: FormGroup;
  schedule_arr: any = [];
  sel_badges: any = [];
  schedule_json: any = [];
  forbadge = false;
  disableButton = false;
  checked_sel_badges = false;
  params;
  src: any;
  locationFind = 'GOOGLEMAP';
  api_error = '';
  lat_lng = {
    latitude: 12.9715987,
    longitude: 77.5945627
  };
  locationType = 'googleMap';
  mapaddress;
  locationName;
  @ViewChild('googleradio',{static:false}) googleradio:ElementRef;
  @ViewChild('autolocateradio',{static:false}) autolocateradio:ElementRef;
  @ViewChild('manualradio',{static:false}) manualradio:ElementRef;

  constructor(
    private provider_services: ProviderServices,
    private shared_Functionsobj: SharedFunctions,
    private router: Router,
    private activated_route: ActivatedRoute,
    private sanitizer: DomSanitizer,
    private provider_shared_functions: ProviderSharedFuctions,
    private fb: FormBuilder,
    public fed_service: FormMessageDisplayService,
    private _location: Location,
    private groupService: GroupStorageService,
    private snackbarService: SnackbarService,
    private wordProcessor: WordProcessor,
    public shared_service: SharedServices,
    private jaldeeTimeService: JaldeeTimeService,
    private dialog: MatDialog) {
    this.activated_route.params.subscribe(params => {
      this.location_id = params.id;
    });
    this.activated_route.queryParams.subscribe(qparams => {
      this.params = qparams;
      if (this.params && this.params.src) {
        this.src = this.params.src;
      }
      if (this.params.action === 'editbase') {
        this.action = 'edit';
      } else {
        this.action = qparams.action;
      }
    });
  }
  ngOnInit() {
    this.badgeIcons = projectConstants.LOCATION_BADGE_ICON;
    this.getLocationBadges();
    if (this.location_id !== 'add') {
      this.getLocationDetail();
    } else {
      const breadcrumbs = [];
      this.breadcrumbs_init.map((e) => {
        breadcrumbs.push(e);
      });
      breadcrumbs.push({
        title: 'Add'
      });
      this.breadcrumbs = breadcrumbs;
      this.action = this.location_id;
      this.createForm();
    }
    this.isCheckin = this.groupService.getitemFromGroupStorage('isCheckin');
  }
  ngOnDestroy() {
    if (this.editlocdialogRef) {
      this.editlocdialogRef.close();
    }
  }
  createForm(type?) {
    this.amForm = this.fb.group({
      locname: ['', Validators.compose([Validators.required, Validators.pattern(projectConstantsLocal.VALIDATOR_BLANK_FALSE)])],
      locaddress: ['', Validators.compose([Validators.required, Validators.maxLength(200)])],
      loclattitude: ['', Validators.compose([Validators.required, Validators.pattern(projectConstantsLocal.VALIDATOR_FLOAT)])],
      loclongitude: ['', Validators.compose([Validators.required, Validators.pattern(projectConstantsLocal.VALIDATOR_FLOAT)])],
      locmapurl: [{ value: '', disabled: true }]
    });
    this.locamForm = this.fb.group({
      open24hours: [''],
      parkingType: ['none']
    });
    if (this.action === 'edit' && !type) {
      this.updateForm();
    }
  }

  updateForm() {

    if (this.location_data) {
      this.amForm.setValue({
        locname: this.location_data.place || null,
        locaddress: this.location_data.address || null,
        loclattitude: this.location_data.lattitude || null,
        loclongitude: this.location_data.longitude || null,
        locmapurl: this.location_data.googleMapUrl || null
      });
      this.locamForm.setValue({
        open24hours: this.location_data.open24hours || null,
        parkingType: this.location_data.parkingType || null
      });
      if (this.location_data.locationVirtualFields) {
        for (const curbadge in this.location_data.locationVirtualFields) {
          if (curbadge) {
            this.sel_badges.push(curbadge);
          }
        }
     }

    this.checked_sel_badges = true;
    }
    this.locationType = this.location_data.locationType;
    this.schedule_arr = [];
    // extracting the schedule intervals
    if (this.location_data && this.location_data.bSchedule && this.location_data.bSchedule.timespec) {
      for (let i = 0; i < this.location_data.bSchedule.timespec.length; i++) {
        for (let j = 0; j < this.location_data.bSchedule.timespec[i].repeatIntervals.length; j++) {
          // pushing the schedule details to the respective array to show it in the page
          this.schedule_arr.push({
            day: this.location_data.bSchedule.timespec[i].repeatIntervals[j],
            sTime: this.location_data.bSchedule.timespec[i].timeSlots[0].sTime,
            eTime: this.location_data.bSchedule.timespec[i].timeSlots[0].eTime
          });
        }
      }
    }
  }

  getLocationDetail() {
    this.api_loading = true;
    this.provider_services.getLocationDetail(this.location_id)
      .subscribe(
        data => {
          this.location_data = data;
          this.locationType = this.location_data.locationType;
          if(this.location_data.locationType === 'googleMap') {
            this.locationFind = 'GOOGLEMAP';
          }
          if(this.location_data.locationType === 'manual') {
            this.locationFind = 'MANUAL';
          }
          if(this.location_data.locationType === 'automatic') {
            this.locationFind = 'AUTODETECT';
          }
          this.api_loading = false;
          let schedule_arr = [];
          this.active_Schedules = [];
          this.schedule_ar = [];
          if (this.location_data.bSchedule) {
            for (let i = 0; i < this.location_data.bSchedule.timespec.length; i++) {
              schedule_arr = this.shared_Functionsobj.queueSheduleLoop(this.location_data.bSchedule.timespec[i]);
              if (schedule_arr.length !== 0) {
                this.active_Schedules.push(schedule_arr);
              }
            }
          }
          for (let i = 0; i < this.active_Schedules.length; i++) {
            this.schedule_ar.push(this.jaldeeTimeService.arrageScheduleforDisplay(this.active_Schedules[i]));
          }
          this.display_schedule = [];
          for (let i = 0; i < this.schedule_ar.length; i++) {
            this.display_schedule[i] = this.schedule_ar[i][0];
          }
          this.getQueueList();
          // remove multiple end breadcrumb on edit function
          const breadcrumbs = [];
          this.breadcrumbs_init.map((e) => {
            breadcrumbs.push(e);
          });
          breadcrumbs.push({
            title: this.location_data.place
          });
          this.breadcrumbs = breadcrumbs;
          if (this.location_data.lattitude !== '' && this.location_data.longitude !== '') {
            this.mapurl = this.sanitizer.bypassSecurityTrustResourceUrl('https://www.google.com/maps/embed/v1/view?zoom=11&center=' + this.location_data.lattitude + ',' + this.location_data.longitude + '&key=' + projectConstants.GOOGLEAPIKEY);
          }
          if (this.action === 'edit') {
            this.createForm();
          }
        },
        () => {
          this.api_loading = false;
          this.goBack();
        }
      );
  }
  changeProviderLocationStatus(obj) {
    this.provider_shared_functions.changeProviderLocationStatusMessage(obj)
      .then((msg_data) => {
        this.provider_services.changeProviderLocationStatus(obj.id, msg_data['chgstatus'])
          .subscribe(() => {
            if (msg_data['chgstatus'] === 'enable') {
              msg_data['msg'] = msg_data['msg'] + '. ' + Messages.ENBALE_QUEUES;
            }
            this.snackbarService.openSnackBar(msg_data['msg']);
            this.getLocationDetail();
          },
            error => {
              this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
              this.getLocationDetail();
            });
      });
  }
  changeProviderBaseLocationStatus(obj) {
    this.provider_services.changeProviderBaseLocationStatus(obj.id)
      .subscribe(() => {
        this.snackbarService.openSnackBar(Messages.WAITLIST_LOCATION_CHG_BASELOCATION.replace('[locname]', obj.place));
        this.getLocationDetail();
      },
        error => {
          this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
          this.getLocationDetail();
        });
  }
  getQueueList() {
    if (this.location_id) {
      this.provider_services.getProviderLocationQueues(this.location_id)
        .subscribe(
          data => {
            this.queues = data;
            for (let ii = 0; ii < this.queues.length; ii++) {
              let schedule_arr = [];
              // extracting the schedule intervals
              if (this.queues[ii].queueSchedule) {
                schedule_arr = this.shared_Functionsobj.queueSheduleLoop(this.queues[ii].queueSchedule);
              }
              let display_schedule = [];
              display_schedule = this.jaldeeTimeService.arrageScheduleforDisplay(schedule_arr);
              this.queues[ii]['displayschedule'] = display_schedule;
            }
          },
          () => {
          }
        );
    }
  }
  goBack() {
    if (this.src === 'h') {
    this.backPage();
    } else {
      this.router.navigate(['provider', 'settings', 'general',
      'locations']);
    }
  }
  editLocation(badge?) {
    if (badge) {
      this.editlocdialogRef = this.dialog.open(AddProviderWaitlistLocationsComponent, {
        width: '50%',
        panelClass: ['popup-class', 'commonpopupmainclass', 'locationoutermainclass'],
        disableClose: true,
        autoFocus: true,
        data: {
          location: this.location_data,
          badges: this.loc_badges,
          type: 'edit',
          source: 'waitlist',
          forbadge: (badge) ? true : false
        }
      });
      this.editlocdialogRef.afterClosed().subscribe(result => {
        if (result) {
          if (result === 'reloadlist') {
            this.getLocationDetail();
          }
        }
      });
    } else {
      this.action = 'edit';
      this.createForm();
    }
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

  getLocationBadges() {
    this.provider_services.getLocationBadges()
      .subscribe(data => {
        this.loc_badges = data;
        for (const badge of this.loc_badges) {
          this.badge_map_arr[badge.name] = badge.displayName;
        }
      });
  }
  objectKeys(obj) {
    return Object.keys(obj);
  }
  changeProviderQueueStatus(obj) {
    this.provider_shared_functions.changeProviderQueueStatus(this, obj, 'location_detail');
  }
  addEditProviderQueue(type, queue = null) {
    if (type === 'edit') {
      const navigationExtras: NavigationExtras = {
        queryParams: { action: 'edit', source: 'location_detail', activeQueues: this.provider_shared_functions.getActiveQueues(), locationId: this.location_id }
      };
      this.router.navigate(['provider', 'settings', 'q-manager', 'queues', queue.id], navigationExtras);
    } else {
      const navigationExtras: NavigationExtras = {
        queryParams: { source: 'location_detail', activeQueues: this.provider_shared_functions.getActiveQueues(), locationId: this.location_id }
      };
      this.router.navigate(['provider', 'settings', 'q-manager', 'queues', 'add'], navigationExtras);
    }
  }
  goQueueDetail(queue) {
    const navigationExtras: NavigationExtras = {
      queryParams: { action: 'view' }
    };
    this.router.navigate(['provider', 'settings', 'q-manager', 'queues', queue.id], navigationExtras);
  }
  public GetControl(form: FormGroup, field: string) {
    return form.get(field);
  }
  showGooglemap() {
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
              locmapurl: mapurl || null,
            });
          }
          this.amForm.patchValue({
            locaddress: result['address'] || null
          });
          this.amForm.patchValue({
            locname: result['location']
          });
        }
      }
    });
  }
  handlesSaveschedule(obj) {
    this.schedule_arr = obj;
  }
  onSubmit(form_data, amenties_FormData) {
    // console.log(amenties_FormData);
    this.disableButton = true;
    let post_itemdata2;
    // Check whether atleast one schedule is added
    // if (this.schedule_arr.length === 0) {
    //     this.schedule_json = [];
    // } else {
    this.schedule_json = [];
    let mon;
    const cdate = new Date();
    mon = (cdate.getMonth() + 1);
    if (mon < 10) {
      mon = '0' + mon;
    }
    const today = cdate.getFullYear() + '-' + mon + '-' + cdate.getDate();
    const daystr = ['1', '2', '3', '4', '5', '6', '7'];
    // const save_schedule = this.shared_Functionsobj.prepareScheduleforSaving(this.schedule_arr);
    // for (const schedule of save_schedule) {
    this.schedule_json.push({
      'recurringType': 'Weekly',
      'repeatIntervals': daystr,
      'startDate': today,
      'terminator': {
        'endDate': '',
        'noOfOccurance': ''
      },
      'timeSlots': [{
        'sTime': '09:00 AM',
        'eTime': '06:00 PM'
      }]
    });
    // }
    // }
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
      const pattern2 = new RegExp(projectConstantsLocal.VALIDATOR_BLANK);
      const result2 = pattern2.test(curlabel);
      if (result2) {
        this.snackbarService.openSnackBar(Messages.BPROFILE_LOCNAME_BLANK, { 'panelClass': 'snackbarerror' }); // 'Phone label should not be blank';
        this.disableButton = false;
        return;
      }
      form_data.locmapurl = this.amForm.controls['locmapurl'].value;
      post_itemdata2 = {
        'place': form_data.locname || '',
        'longitude': form_data.loclongitude || '',
        'lattitude': form_data.loclattitude || '',
        'googleMapUrl': form_data.locmapurl || '',
        'address': form_data.locaddress || '',
        'locationType': this.locationType || ''
      };
      if (this.schedule_json.length > 0) {
        post_itemdata2.bSchedule = {};
        post_itemdata2.bSchedule.timespec = this.schedule_json;
      }
    }
    if (this.location_data && this.location_data.id) {
      post_itemdata2.id = this.location_data.id;
      this.provider_services.editProviderLocation(post_itemdata2)
        .subscribe(
          () => {
            this.snackbarService.openSnackBar(Messages.WAITLIST_LOCATION_UPDATED, { 'panelclass': 'snackbarerror' });

            amenties_FormData.locationVirtualFields = {};
            amenties_FormData.id = this.location_data.id;
            if (this.sel_badges.length > 0) {
              for (let i = 0; i < this.sel_badges.length; i++) {
                amenties_FormData.locationVirtualFields[this.sel_badges[i]] = true;
              }
            }

            this.provider_services.editProviderLocation(amenties_FormData)
              .subscribe(
                (response) => {
                  this.wordProcessor.getProjectMesssages('WAITLIST_LOCATION_AMINITIES_UPDATED');
                  this.getLocationDetail();
                  if (this.params.action === 'editbase') {
                    this.router.navigate(['provider', 'settings', 'bprofile']);
                  } else {
                    this.action = 'view';
                  }
                  this.disableButton = false;
                },
                error => {
                  this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
                  this.disableButton = false;
                }

              );


          },
          error => {
            this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
            this.disableButton = false;
          }
        );
    } else {
      this.provider_services.addProviderLocation(post_itemdata2)
        .subscribe(
          (data) => {
            this.location_id = data;

            amenties_FormData.locationVirtualFields = {};
            amenties_FormData.id = data;
            if (this.sel_badges.length > 0) {
              for (let i = 0; i < this.sel_badges.length; i++) {
                amenties_FormData.locationVirtualFields[this.sel_badges[i]] = true;
              }
            }

            this.provider_services.editProviderLocation(amenties_FormData)
              .subscribe(
                (response) => {
                  this.snackbarService.openSnackBar(Messages.WAITLIST_LOCATION_CREATED, { 'panelclass': 'snackbarerror' });
                  this.shared_Functionsobj.sendMessage({ 'ttype': 'locationChange' });
                  this.getLocationDetail();
                  this.getLocationBadges();
                  this.disableButton = false;
                  this.goBack();
                  // this.router.navigate(['provider', 'settings', 'bprofile']);


                },
                error => {
                  this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
                  this.disableButton = false;
                }
              );

          },
          error => {
            this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
            this.disableButton = false;
          }
        );
    }
  }


  closeClick() {
    if (this.action === 'edit' && this.params.action !== 'editbase') {
      this.action = 'view';
    } else {
      this._location.back();
    }
  }
  backPage() {
    this._location.back();
  }
  handlelocationfind(val) {
    this.locationType = val;
    console.log(this.locationFind);
    const type = this.locationFind;
    console.log(type);
    this.locationFind = '';
    if (val === 'googleMap') {
        const dialogrefd = this.dialog.open(ConfirmBoxComponent, {
          width: '50%',
          panelClass: ['popup-class', 'commonpopupmainclass', 'confirmationmainclass'],
          disableClose: true,
          data: {
            'message': 'Do you want to detect location using google map?'
          }
        });
        dialogrefd.afterClosed().subscribe(result => {
          if (result==0) {
            this.locationFind = type;
          }
          else {
            this.locationFind = 'GOOGLEMAP';
            setTimeout(() => {
              this.googleradio.nativeElement.focus();
            }, 100);
            this.createForm('change');
          }
         });

    } else if (val === 'automatic') {
        const dialogrefd = this.dialog.open(ConfirmBoxComponent, {
          width: '50%',
          panelClass: ['popup-class', 'commonpopupmainclass', 'confirmationmainclass'],
          disableClose: true,
          data: {
            'message': 'Do you want to detect location automatically?'
          }
        });
        dialogrefd.afterClosed().subscribe(result => {
          if (result==0) {
            this.locationFind = type;
          }
          else {
            this.locationFind = 'AUTODETECT';
            setTimeout(() => {
              this.autolocateradio.nativeElement.focus();
            }, 100);
            this.createForm('change');
          }         });
    } else if(val === 'manual'){
        const dialogrefd = this.dialog.open(ConfirmBoxComponent, {
          width: '50%',
          panelClass: ['popup-class', 'commonpopupmainclass', 'confirmationmainclass'],
          disableClose: true,
          data: {
            'message': 'Do you want to add location manually?'
          }
        });
        dialogrefd.afterClosed().subscribe(result => {
          if (result==0) {
            this.locationFind = type;
          }
          else {
            this.locationFind = 'MANUAL';
            setTimeout(() => {
              this.manualradio.nativeElement.focus();
            }, 100);
            this.createForm('change');
          }
         });

    }
}
clearFormFields(){
  this.amForm.setValue({
    locname: '',
    locaddress: '',
    loclattitude: '',
    loclongitude: '',
    locmapurl: ''
  });
  // this.locamForm.setValue({
  //   open24hours: '',
  //   parkingType: ''
  // });
}
getCurrentLocation() {
  if (navigator) {
    navigator.geolocation.getCurrentPosition(pos => {
     console.log(pos)
     this.amForm.controls.loclattitude.setValue(pos.coords.latitude);
     this.amForm.controls.loclongitude.setValue(pos.coords.longitude);
     this.lat_lng.longitude = +pos.coords.longitude;
     this.lat_lng.latitude = +pos.coords.latitude;
     this.getAddressfromLatLong();
    },
      error => {
          this.api_error = 'You have blocked Jaldee from tracking your location. To use this, change your location settings in browser.';
          this.snackbarService.openSnackBar(this.api_error, { 'panelClass': 'snackbarerror' });

      });
  }
  
}
getAddressfromLatLong() {
  console.log(this.lat_lng)
  this.shared_service.getAddressfromLatLong(this.lat_lng).subscribe(data => {
    const currentAddress = this.shared_service.getFormattedAddress(data);
    console.log(data)
    this.mapaddress = [];
    this.mapaddress.push({ 'address': currentAddress, 'pin': data['pinCode'] });
    this.amForm.controls.locaddress.setValue(this.mapaddress[0].address, this.mapaddress[0].pin);
    if(data['area'] == undefined){
      this.locationName = data['district'];
      console.log(data['district'])
    } else {
      this.locationName = data['area'];
      console.log(data['area'])

    }
    this.amForm.controls.locname.setValue(this.locationName);
  });
}
}
