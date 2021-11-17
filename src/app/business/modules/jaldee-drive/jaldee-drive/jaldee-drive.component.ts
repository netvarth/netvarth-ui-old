import { Component, OnChanges, OnInit, ViewChild } from '@angular/core';
import { GroupStorageService } from '../../../../shared/services/group-storage.service';

import { projectConstants } from '../../../../app.component';
import { SnackbarService } from '../../../../shared/services/snackbar.service';
import { Messages } from '../../../../shared/constants/project-messages';
import { Router, NavigationExtras } from '@angular/router';
import { LocalStorageService } from '../../../../shared/services/local-storage.service';
import { Location } from '@angular/common';
// import { AddproviderAddonComponent } from '../../../../ynw_provider/components/add-provider-addons/add-provider-addons.component';
import { MatDialog } from '@angular/material/dialog';
import { PreviewuploadedfilesComponent } from '../previewuploadedfiles/previewuploadedfiles.component';
import { ProviderServices } from '../../../../business/services/provider-services.service';


@Component({
  selector: 'app-jaldee-drive',
  templateUrl: './jaldee-drive.component.html',
  styleUrls: ['./jaldee-drive.component.css']
})
export class JaldeeDriveComponent implements OnInit, OnChanges {
  bname;
  searchTerm: any;
  blogo = '';
  userDetails: any = [];
  userData;
  branchName = '';
  bsubsector = '';
  bsector = '';
  bdetails: any;
  cols: any[];
  value: number = 0;
  // products: Product[];
  products = [];
  customers: any[] = [];
  Allfiles: any;
  filter_sidebar = false;
  tooltipcls = '';
  action: any = '';
  apiError = '';
  apiSuccess = '';
  selectedMessage = {
    files: [],
    base64: [],
    caption: []
  };
  @ViewChild('modal') modal;
  imgCaptions: any = [];
  choose_type = 'private';
  active_user: any;
  filter = {
    fileSize: '',
    fileName: '',
    fileType: '',
    checkinEncId: '',
    folderName: '',
    page_count: projectConstants.PERPAGING_LIMIT,
    page: 1
  };
  filterapplied = false;
  filters: any = {
    'firstName': false,
    'lastName': '',
    'city': false,
    'state': false,
    'pinCode': false,
    'primaryMobileNo': false,
    'employeeId': false,
    'email': false,
    'userType': false,
    'folderName': false,
  };
  filtericonTooltip = '';
  // breadcrumb_moreoptions: any = [];
  domain;
  open_filter = false;
  // breadcrumbs = [
  //   {
  //     url: '/provider/settings',
  //     title: 'Settings'

  //   },
  //   {
  //     title: Messages.GENERALSETTINGS,
  //     url: '/provider/settings/general'
  //   },
  //   {
  //     title: 'Users'
  //   }
  // ];
  // userTypesFormfill: any = [
  //   {
  //     name: 'ASSISTANT',
  //     displayName: 'Assistant'
  //   },
  //   {
  //     name: 'PROVIDER',
  //     displayName: 'Provider'
  //   },
  //   {
  //     name: 'ADMIN',
  //     displayName: 'Admin'
  //   }];
  api_loading: boolean;
  // departments: any;
  loadComplete = false;
  user_count: any = 0;
  pagination: any = {
    startpageval: 1,
    totalCnt: 0,
    perPage: this.filter.page_count
  };
  linkprofiledialogRef;
  provId;
  businessConfig: any;
  provider_label = '';
  assistant_label = '';
  changeUserStatusdialogRef;
  order = 'status';
  defaultFolder = 'private';
  selectedFolder: any;

  use_metric;
  usage_metric: any;
  adon_info: any;
  adon_total: any;
  adon_used: any;
  disply_name: any;
  warningdialogRef: any;
  loading = true;
  languages_arr: any = [];
  specialization_arr: any = [];
  user;
  selectedLanguages: any = [];
  selectedLocations: any = [];
  selectedSpecialization: any = [];
  selectedUser;
  selectrow = false;
  user_count_filterApplied: any;
  availabileSelected: boolean;
  notAvailabileSelected: boolean;
  lessMb: boolean;
  grateMB: boolean;
  accountSettings;
  contactDetailsdialogRef: any;
  user_list_dup: any = []
  user_list_add: any
  teamDescription = '';
  teamName = '';
  size = '';
  showAddCustomerHint = false;
  @ViewChild('closebutton') closebutton;
  @ViewChild('locclosebutton') locclosebutton;
  groups: any;
  teamLoaded = false;
  teamEdit = false;
  groupIdEdit = '';
  selectedTeam;
  showUsers = false;
  userIds: any = [];
  showcheckbox = false;
  addlocationcheck = false;
  loc_list: any = [];
  locationsjson: any = [];
  locIds: any = [];
  newlyCreatedGroupId;
  showteams = false;
  showusers = false;
  selecteTeamdUsers: any = [];
  addUser = false;
  totalcount: any;
  storageleft: any;
  weightageValue = 0;
  addondialogRef: any;
  fileviewdialogRef: any;
  p: number = 1;
  // itemsPerPage:any;
  // currentPage:any;
  config: any;
  count: number = 0;

  constructor(
    private groupService: GroupStorageService,
    private provider_servicesobj: ProviderServices,
    private snackbarService: SnackbarService,
    private lStorageService: LocalStorageService,
    private router: Router,
    public location: Location,
    public dialog: MatDialog,
  ) {
    this.config = {
      itemsPerPage: 5,
      currentPage: 1,
      totalItems: this.customers.length
    };
  }

  pageChanged(event) {
    this.config.currentPage = event;
  }
  ngOnInit(): void {
    this.getPatientFiles();
    this.getfiles();
    this.userData = this.groupService.getitemFromGroupStorage('ynw-user');
    this.active_user = this.groupService.getitemFromGroupStorage('ynw-user');
    console.log(this.active_user);
    this.getBusinessdetFromLocalstorage();

    // this.cols = [
    //   { field: 'code', header: 'Code' },
    //   { field: 'name', header: 'Name' },
    //   { field: 'category', header: 'Category' },
    //   { field: 'quantity', header: 'Quantity' }
    // ];
    this.getTotalFileShareCount();
    this.getFileStorage();
  }

  ngOnChanges() {
    this.getfiles();
  }




  getFileStorage() {
    this.provider_servicesobj.getFileStorage().subscribe(
      (data: any) => {
        console.log(data);
        this.storageleft = data;
        this.weightageValue = this.storageleft.usedStorage
      }
    );
  }
  getTotalFileShareCount() {
    this.provider_servicesobj.getTotalFileShareCount(0).subscribe(
      (data: any) => {
        console.log(data);
        this.totalcount = data
      }
    );
  }
  getfiles() {
    this.provider_servicesobj.getAllFileAttachments().subscribe(
      (data: any) => {
        console.log(data);
        this.customers = data
      }
    );
  }
  getBusinessdetFromLocalstorage() {
    this.bdetails = this.groupService.getitemFromGroupStorage('ynwbp');
    console.log(this.bdetails);
    if (this.bdetails) {
      this.bsector = this.bdetails.bs || '';
      this.bsubsector = this.bdetails.bss || '';
      if (this.userData.accountType === 'BRANCH' && this.userData.userType !== 2) {
        this.branchName = this.bdetails.bn || 'User';
        this.bname = this.userData.userName || 'User';
        if (this.userDetails.profilePicture) {
          this.blogo = this.userDetails.profilePicture;
        } else if (this.bdetails.logo) {
          this.blogo = this.bdetails.logo;
        } else {
          this.blogo = '../../../assets/images/img-null.svg';
        }
      } else {
        this.bname = this.bdetails.bn || 'User';
        this.blogo = this.bdetails.logo || '../../../assets/images/img-null.svg';
      }
    }
  }
  showFilterSidebar() {
    this.getfiles();
    this.filter_sidebar = true;
    console.log(this.filter_sidebar);
  }
  hideFilterSidebar() {
    this.filter_sidebar = false;
  }
  applyPromocode() {
    this.action = 'attachment';
    console.log(this.action);
  }
  popupClosed() {
  }
  actionCompleted() {
    console.log(this.action);
    if (this.action === 'attachment' && this.choose_type && this.selectedMessage) {
      console.log("After Click of OK Button :",this.action,this.choose_type,this.selectedMessage);
      const dataToSend: FormData = new FormData();
      const captions = {};
      let i = 0;
      if (this.selectedMessage) {
        for (const pic of this.selectedMessage.files) {
          if (this.selectedMessage.files['name'] === pic['name']) {
            //this.snackbarService.openSnackBar('Error', { 'panelClass': 'snackbarerror' });
            alert("Already Existed...")
          }
          else {
            dataToSend.append('attachments', pic, pic['name']);
            captions[i] = (this.imgCaptions[i]) ? this.imgCaptions[i] : '';
            i++;
          }
        }
        this.selectedMessage = {
          files: [],
          base64: [],
          caption: []
        }
      }
      const blobPropdata = new Blob([JSON.stringify(captions)], { type: 'application/json' });
      dataToSend.append('captions', blobPropdata);

      this.provider_servicesobj.uploadAttachments(this.choose_type, this.active_user.id, dataToSend)
        .subscribe(
          () => {
            this.snackbarService.openSnackBar(Messages.ATTACHMENT_UPLOAD, { 'panelClass': 'snackbarnormal' });
            this.selectedMessage = {
              files: [],
              base64: [],
              caption: []
            }

          },
          error => {
            this.snackbarService.openSnackBar(error.error, { 'panelClass': 'snackbarerror' });

          }
        );

      this.selectedMessage = {
        files: [],
        base64: [],
        caption: []
      }

    }
    else{
      alert('Please attach atleast one file.');

    }

    this.getfiles();
  }
  getImage(url, file) {
    if (file.type == 'application/pdf') {
      return '../../../../../assets/images/pdf.png';
    } else {
      return url;
    }
  }
  deleteTempImage(i) {
    this.selectedMessage.files.splice(i, 1);
    this.selectedMessage.base64.splice(i, 1);
    this.selectedMessage.caption.splice(i, 1);
    this.imgCaptions[i] = '';
  }
  filesSelected(event, type?) {
    const input = event.target.files;
    console.log(input);
    if (input) {
      for (const file of input) {
        if (projectConstants.FILETYPES_UPLOAD.indexOf(file.type) === -1) {
          this.snackbarService.openSnackBar('Selected image type not supported', { 'panelClass': 'snackbarerror' });
          return;
        } else if (file.size > projectConstants.FILE_MAX_SIZE) {
          this.snackbarService.openSnackBar('Please upload images with size < 10mb', { 'panelClass': 'snackbarerror' });
          return;
        } else {
          this.selectedMessage.files.push(file);
          // this.selectedMessage.files = '';
          const reader = new FileReader();
          reader.onload = (e) => {
            this.selectedMessage.base64.push(e.target['result']);
          };
          reader.readAsDataURL(file);
          this.action = 'attachment';
        }
      }
      if (type && this.selectedMessage.files && this.selectedMessage.files.length > 0 && input.length > 0) {
        this.modal.nativeElement.click();
      }
    }
  }
  consumerNoteAndFileSave(uuids, parentUid?, paymenttype?) {

  }
  changeType(event) {


    if(event.value === 'private'){
      this.choose_type = event.value;
    }
    else{
      this.choose_type = event.value;

    }
    // //this.choose_type = event.value;
    // if (event) {
    //    this.selectedFolder = event.value
    //   // this.virtualForm.get('preferredLanguage').setValue(['English']);
    //   this.choose_type = this.selectedFolder;

    // }
    // else {
    //   this.choose_type = event.value;
    // }

    console.log("File Type : ",this.choose_type);
  }
  publicfolder(foldername) {
    const navigationExtras: NavigationExtras = {
      queryParams: {
        foldername: foldername,
      }
    };
    this.router.navigate(['provider', 'drive', 'folderfiles'], navigationExtras);
  }
  getPatientFiles() {
    this.getfiles();

  }
  getUsers(from_oninit = false) {
    this.loading = true;

    let filter = this.setFilterForApi();
    if (filter) {
      console.log(filter);
      this.lStorageService.setitemonLocalStorage('userfilter', filter);
      this.provider_servicesobj.getAllFilterAttachments(filter).subscribe(
        (data: any) => {
          console.log(data);
          // this.Allfiles = data;
          this.customers = data
          this.api_loading = false;
        }
      );
    }
    // else {
    //   this.getfiles();
    // }
  }
  clearFilter() {
    this.lStorageService.removeitemfromLocalStorage('userfilter');
    this.resetFilter();
    this.filterapplied = false;
    this.getfiles();
  }
  resetFilter() {
    this.filters = {
      'firstName': false,
      'lastName': false,
      'city': false,
      'state': false,
      'pinCode': false,
      'primaryMobileNo': false,
      'employeeId': false,
      'email': false,
      'userType': false,
      'available': false,
    };
    this.filter = {
      fileSize: '',
      fileName: '',
      fileType: '',
      checkinEncId: '',
      folderName: '',
      page_count: projectConstants.PERPAGING_LIMIT,
      page: 1
    };
    this.selectedSpecialization = [];
    this.selectedLanguages = [];
    this.selectedLocations = [];
  }
  doSearch() {
    this.lStorageService.removeitemfromLocalStorage('userfilter');
    if (this.filter.fileSize || this.filter.fileName || this.filter.fileType || this.filter.folderName || this.filter.checkinEncId || this.selectedLanguages.length > 0 || this.selectedLocations.length > 0 || this.selectedSpecialization.length > 0) {
      this.filterapplied = true;
    } else {
      this.filterapplied = false;
    }
  }
  focusInput(ev, input) {
    const kCode = parseInt(ev.keyCode, 10);
    if (kCode === 13) {
      input.focus();
      this.doSearch();
    }
  }
  setPaginationFilter(api_filter) {
    api_filter['from'] = (this.pagination.startpageval) ? (this.pagination.startpageval - 1) * this.filter.page_count : 0;
    api_filter['count'] = this.filter.page_count;
    return api_filter;
  }
  setFilterForApi() {
    let api_filter = {};
    const filter = this.lStorageService.getitemfromLocalStorage('userfilter');
    if (filter) {
      api_filter = filter;
      this.initFilters(filter);
    }
    if (this.filter.fileSize !== '') {
      if (this.grateMB) {
        api_filter['fileSize-gt'] = this.filter.fileSize;
      } else {
        api_filter['fileSize-lt'] = this.filter.fileSize;
      }
    }
    if (this.filter.fileName !== '') {
      api_filter['fileName-like'] = this.filter.fileName;
    }
    if (this.filter.fileType !== '') {
      api_filter['fileType-eq'] = this.filter.fileType;
    }

    if (this.filter.folderName !== '') {
      api_filter['folderName-eq'] = this.filter.folderName;
    }

    if (this.filter.checkinEncId !== '') {
      api_filter['bookingId-eq'] = this.filter.checkinEncId;
    }
    if (this.selectedLanguages.length > 0) {
      api_filter['spokenlangs-eq'] = this.selectedLanguages.toString();
    }
    if (this.selectedLocations.length > 0) {
      api_filter['businessLocs-eq'] = this.selectedLocations.toString();
    }
    if (this.selectedSpecialization.length > 0) {
      api_filter['specialization-eq'] = this.selectedSpecialization.toString();
    }
    if (this.selectedTeam === 'all' || this.addUser) {
      delete api_filter['teams-eq'];
    }
    return api_filter;
  }
  initFilters(filter) {
    if (Object.keys(filter).length > 0) {
      Object.keys(filter).forEach(key => {
        const splitedKey = key.split('-');
        if (splitedKey[0] === 'spokenlangs') {
          const values = filter[key].split(',');
          this.selectedLanguages = values;
        } else if (splitedKey[0] === 'businessLocs') {
          let values = filter[key].split(',');
          values = values.map(value => JSON.parse(value));
          this.selectedLocations = values;
        } else if (splitedKey[0] === 'specialization') {
          const values = filter[key].split(',');
          this.selectedSpecialization = values;
        } else {
          this.filter[splitedKey[0]] = filter[key];
        }
      });
      this.filterapplied = true;
    }
  }
  setFilterDataCheckbox(type, value) {
    if (type === 'folder') {
      if (value === 'true') {
        this.availabileSelected = true;
        this.notAvailabileSelected = false;
        this.filter.folderName = 'public';
      }
      else {
        this.availabileSelected = false;
        this.notAvailabileSelected = true;
        this.filter.folderName = 'private';
      }
    }
    if (type === 'fileSize') {
      if (value === 'true') {
        this.lessMb = true;
        this.grateMB = false;
        this.filter.fileSize = '1';
      }
      else {
        this.lessMb = false;
        this.grateMB = true;
        this.filter.fileSize = '1';
      }
    }
    this.doSearch();
  }
  gotoSettings() {
    // const loggedUser = this.groupService.getitemFromGroupStorage('ynw-user');
    // const userid = loggedUser.id
    // if(this.account_type == 'BRANCH' && this.userData.userType == 1){
    //   this.routerobj.navigate(['provider', 'settings', 'general', 'users', userid, 'settings']);
    // }else{
    this.router.navigate(['provider', 'settings']);
    // }
  }
  gotoSmsAddon() {
    // if (this.corpSettings && this.corpSettings.isCentralised) {
    //   this.snackbarService.openSnackBar(Messages.CONTACT_SUPERADMIN, { 'panelClass': 'snackbarerror' });
    // } else {
    // this.addondialogRef = this.dialog.open(AddproviderAddonComponent, {
    //   width: '50%',
    //   data: {
    //     type: 'addons'
    //   },
    //   panelClass: ['popup-class', 'commonpopupmainclass'],
    //   disableClose: true
    // });
    // this.addondialogRef.afterClosed().subscribe(result => {
    //   if (result) {
    //   }
    // });
    const navigationExtras: NavigationExtras = {
      queryParams: {
        data: 'jaldee-drive',
        //disp_name:'CloudStorage'
      }
    };
    this.router.navigate(['provider', 'license', 'addons'], navigationExtras);

  }
  preview(file) {
    console.log("Files : ", this.customers)
    this.fileviewdialogRef = this.dialog.open(PreviewuploadedfilesComponent, {
      width: '50%',
      panelClass: ['popup-class', 'commonpopupmainclass', 'uploadfilecomponentclass'],
      disableClose: true,
      data: {
        file: file,

      }
    });
    this.fileviewdialogRef.afterClosed().subscribe(result => {
      if (result) {

      }
    });
  }
}
