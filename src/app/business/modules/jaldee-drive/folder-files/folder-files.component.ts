import { Component, OnInit, ViewChild } from '@angular/core';
import { Location } from '@angular/common';

import { ActivatedRoute } from '@angular/router';
//import { Router } from '@angular/router';
//import { MatPaginator } from '@angular/material/paginator';

import { MatDialog } from '@angular/material/dialog';
import { PreviewuploadedfilesComponent } from '../previewuploadedfiles/previewuploadedfiles.component';
import { LocalStorageService } from '../../../../shared/services/local-storage.service';
import { ProviderServices } from '../../../../business/services/provider-services.service';
import { SnackbarService } from '../../../../shared/services/snackbar.service';
import { Messages } from '../../../../shared/constants/project-messages';
import { GroupStorageService } from '../../../../shared/services/group-storage.service';
// import { WordProcessor } from 'src/app/shared/services/word-processor.service';
// import { WordProcessor } from '../../../shared/services/word-processor.service';



export let projectConstants: any = {};



@Component({
  selector: 'app-folder-files',
  templateUrl: './folder-files.component.html',
  styleUrls: ['./folder-files.component.css']
})
export class FolderFilesComponent implements OnInit {
  customers: any[] = [];
  fileSizeFilter: any;
  loading = true;
  blogo = '';
  bname;
  userDetails: any = [];
  userData;
  branchName = '';
  bsubsector = '';
  bsector = '';
  bdetails: any;
  cols: any[];
  value: number = 0;
  api_loading: boolean;
  selectedTeam;
  addUser = false;
  tooltipcls = '';
  fileTypeDisplayName = projectConstants.FilE_TYPES;
  apiloading = false;
  foldertype: any;
  foldername: any;
  fileviewdialogRef: any;
  filter_sidebar = false;
  filterapplied = false;
  pagination: any = {
    startpageval: 1,
    totalCnt: this.customers.length,
    perPage: 3
  };
  choose_type = 'My';
  onClickedConsumer = false;
  onClickedProvider = false;
  sharedFolderName: any;
  active_user: any;
  action: any = '';
  apiError = '';
  apiSuccess = '';
  fileTypeName: any;
  selectedMessage = {
    files: [],
    base64: [],
    caption: []
  };
  filesType: any;
  @ViewChild('modal') modal;
  imgCaptions: any = [];
  @ViewChild('closebutton') closebutton;
  @ViewChild('locclosebutton') locclosebutton;
 // @ViewChild(MatPaginator) paginator: MatPaginator[];

  filter = {
    fileSize: '',
    fileName: '',
    fileType: '',
    // checkinEncId: '',
    contextId: '',
    folderName: '',
    page_count: projectConstants.PERPAGING_LIMIT,
    page: 1
  };
  filtericonTooltip='';

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

  onClickedFolder = false;
  searchTerm: any;
  p: number = 1;
  // itemsPerPage:any;
  // currentPage:any;
  config: any;
  count: number = 0;
  selectedLanguages: any = [];
  selectedLocations: any = [];
  selectedSpecialization: any = [];
  lessMb: boolean;
  grateMB: boolean;
  selectrow = false;
  user_count_filterApplied: any;
  availabileSelected: boolean;
  notAvailabileSelected: boolean;
  tooltipcl = projectConstants.TOOLTIP_CLS;



  constructor(
    private _location: Location,
    private provider_servicesobj: ProviderServices,
    private activated_route: ActivatedRoute,
    public dialog: MatDialog,
    private lStorageService: LocalStorageService,
    private snackbarService: SnackbarService,
    // private wordProcessor: WordProcessor,

    //private router: Router,

    private groupService: GroupStorageService,

  ) {
    this.activated_route.queryParams.subscribe(params => {
      this.foldertype = params.foldername;
      // this.foldertype + ' ' + 'folder';
      this.foldername = this.foldertype;
    });
    this.config = {
      itemsPerPage: 5,
      currentPage: 1,
      totalItems: this.customers.length
      
    };
    //this.filtericonTooltip = this.wordProcessor.getProjectMesssages('FILTERICON_TOOPTIP');

  }
  pageChanged(event) {
    this.config.currentPage = event;
  }
  handle_pageclick(pg) {
    this.pagination.startpageval = pg;
    // this.groupService.setitemToGroupStorage('customerPage', pg);
    this.filter.page = pg;
    // this.doSearch('pageclick');
  }
  ngOnInit() {
    this.getfiles();

    //this.getBusinessdetFromLocalstorage()
    this.active_user = this.groupService.getitemFromGroupStorage('ynw-user');
    console.log(this.active_user);

  }
  doSearch() {
    this.lStorageService.removeitemfromLocalStorage('userfilter');
    if (this.filter.fileSize || this.filter.fileName || this.filter.fileType || this.filter.folderName || this.filter.contextId || this.selectedLanguages.length > 0 || this.selectedLocations.length > 0 || this.selectedSpecialization.length > 0) {
      this.filterapplied = true;
    } else {
      this.filterapplied = false;
    }
  }
  hideFilterSidebar() {
    this.filter_sidebar = false;
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

    if (this.filter.contextId !== '') {
      api_filter['contextId-eq'] = this.filter.contextId;
    }
    // if (this.filter.contextId !== '') {
    //   api_filter['bookingId-eq'] = this.filter.contextId;
    // }
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

  showFilterSidebar() {
    this.getfiles();
    this.filter_sidebar = true;
    console.log(this.filter_sidebar);
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
      // checkinEncId: '',
      contextId: '',
      folderName: '',
      page_count: projectConstants.PERPAGING_LIMIT,
      page: 1
    };
    this.selectedSpecialization = [];
    this.selectedLanguages = [];
    this.selectedLocations = [];
  }
  setFilterDataCheckbox(type, value) {
    if (type === 'folder') {
      if (value === 'true') {
        this.availabileSelected = true;
        this.notAvailabileSelected = false;
        this.filter.folderName = 'Public';
      }
      else {
        this.availabileSelected = false;
        this.notAvailabileSelected = true;
        this.filter.folderName = 'My';
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
  sharedfolder(foldername) {
    console.log("Access!!!")
    //this.onClickedFolder= true;

    if (foldername === 'Provider') {
      this.onClickedProvider = true;
      this.onClickedConsumer = false;
      this.foldertype = 'Shared'
      this.sharedFolderName = foldername;
      this.getfiles();
    }
    if (foldername === 'Consumer') {
      this.onClickedConsumer = true;
      this.onClickedProvider = false;
      this.foldertype = 'Shared'
      this.sharedFolderName = foldername;
      this.getfiles();
    }

    // const navigationExtras: NavigationExtras = {
    //   queryParams: {
    //     foldername: foldername,
    //   }
    // };
    // this.router.navigate(['provider', 'drive', 'folderfiles'], navigationExtras);

  }
  getfiles() {
    const filter = {};
    console.log("Folder Type :", this.foldertype);
    if (this.foldertype === 'Private') {
      filter['folderName-eq'] = 'Private';
      this.foldername = 'My'
    }
    else if (this.foldertype === 'Public') {
      filter['folderName-eq'] = 'Public';
      this.foldername = 'Provider'
      

    }
    else {
      filter['folderName-eq'] = 'Shared';
      this.foldername = 'Consumer'
    }


    console.log(filter);
    console.log("Types :", this.fileTypeDisplayName)
    this.provider_servicesobj.getAllFilterAttachments(filter).subscribe(
      (data: any) => {
        console.log(data);
        // this.Allfiles = data;
        this.customers = data
        //this.paginator = this.customers
        this.customers.map((x) => {
          this.fileSizeFilter = Math.ceil(x.fileSize)
          // console.log("File Size", this.fileSizeFilter)
        })

        //console.log("Uploaded Files : ", this.customers);
      }
    );


  }
  getFileType(fileType) {
    //console.log("Type: ", fileType)

    let fileTypeName = ''
    if (fileType.indexOf('image')) {
      fileTypeName = fileType.split('/')[1];
    }
    if (fileType.indexOf('pdf')) {
      fileTypeName = fileType.split('/')[1];
    }
    // console.log("Files Type  Name: ", fileTypeName)
    return fileTypeName;
  }
  getFileName(fileName) {
    let filename = ''
    //  console.log("Name :",fileName)
    if (fileName.indexOf('fileName')) {
      if(fileName.length>10){
      //  console.log("Length :",fileName.length)
        filename = fileName.slice(0,10)+'...'
      }
      if(fileName.length<=10){
        filename = fileName;
      }
      // split([' '])[0];
    }
    return filename;
  }
  getFileSize(fileSize) {
    // console.log("Size : ", fileSize)

    return Math.round(fileSize)
    // console.log("Sizes greater ",this.fileSizeFilter)

    // this.fileSizeFilter = Math.round(fileSize)
    // console.log("Sizes less ",this.fileSizeFilter)

  }
  actionCompleted() {
    console.log(this.action);
    if (this.action === 'attachment' && this.foldertype && this.selectedMessage) {
      console.log("After Click of OK Button :", this.foldertype, this.action, this.selectedMessage);
      const dataToSend: FormData = new FormData();
      const captions = {};
      let i = 0;



      for (const pic of this.selectedMessage.files) {
        console.log("Selected File Is : ", this.selectedMessage.files, pic['name'], pic)
        //   if(this.selectedMessage.files.indexOf(i) !== -1){
        //     alert(`File ${pic['name']} is Already Existed...`)
        // } 
        //const value = 1;
        //const isInArray = this.selectedMessage.files.includes(pic);
        // if (pic['name'] === this.selectedMessage.files['name']) {
        //   alert(`File ${pic['name']} is Already Existed...`)
        //   // this.snackbarService.openSnackBar(Error.apply('name'), { 'panelClass': 'snackbarerror' });
        // }
        // else {
        dataToSend.append('attachments', pic, pic['name']);
        captions[i] = (this.imgCaptions[i]) ? this.imgCaptions[i] : '';
        i++;
        // }
        console.log("Uploaded Image : ", this.imgCaptions[i]);
      }
      // this.selectedMessage = {
      //   files: [],
      //   base64: [],
      //   caption: []
      // }

      const blobPropdata = new Blob([JSON.stringify(captions)], { type: 'application/json' });
      dataToSend.append('captions', blobPropdata);

      this.provider_servicesobj.uploadAttachments(this.foldertype, this.active_user.id, dataToSend)
        .subscribe(
          () => {
            this.snackbarService.openSnackBar(Messages.ATTACHMENT_UPLOAD, { 'panelClass': 'snackbarnormal' });
            this.selectedMessage = {
              files: [],
              base64: [],
              caption: []
            }
            this.getfiles();

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
    else {
      alert('Please attach atleast one file.');

    }

    this.getfiles();
    console.log("All Files : ", this.getfiles());
  }
  getFolderfiles() {
    this.provider_servicesobj.getAllFileAttachments().subscribe(
      (data: any) => {
        console.log(data);
        this.customers = data
        console.log("The Folder Files : ", this.customers)
      }
    );
  }

  filesSelected(event, type?) {
    const input = event.target.files;
    console.log("File Selected :", input);
    if (input) {
      for (const file of input) {
        // if (projectConstants.FILETYPES_UPLOAD.indexOf(file.type) === -1) {
        //   this.snackbarService.openSnackBar('Selected image type not supported', { 'panelClass': 'snackbarerror' });
        //   return;
        // } else if (file.size > projectConstants.FILE_MAX_SIZE) {
        //   this.snackbarService.openSnackBar('Please upload images with size < 10mb', { 'panelClass': 'snackbarerror' });
        //   return;
        // } else {
        this.selectedMessage.files.push(file);
        // this.selectedMessage.files = '';
        const reader = new FileReader();
        reader.onload = (e) => {
          this.selectedMessage.base64.push(e.target['result']);
        };
        reader.readAsDataURL(file);
        this.action = 'attachment';

      }
      if (type && this.selectedMessage.files && this.selectedMessage.files.length > 0 && input.length > 0) {
        this.modal.nativeElement.click();
      }
    }
  }


  getImage(url, file) {
    if (file.type == 'application/pdf') {
      return '../../../../../assets/images/pdf.png';
    } else {
      return url;
    }
  }

  onBack() {
    //  const navigationExtras: NavigationExtras = {
    //     queryParams: {
    //       foldername: foldername,
    //     }
    //   };
    // this.router.navigate(['provider', 'drive', 'folderfiles']);
  }
  onCancel() {

    this._location.back();

  }
  popupClosed() {
  }

  deleteTempImage(i) {
    this.selectedMessage.files.splice(i, 1);
    this.selectedMessage.base64.splice(i, 1);
    this.selectedMessage.caption.splice(i, 1);
    this.imgCaptions[i] = '';
  }

  // getBusinessdetFromLocalstorage() {
  //   this.bdetails = this.groupService.getitemFromGroupStorage('ynwbp');
  //   console.log(this.bdetails);
  //   if (this.bdetails) {
  //     this.bsector = this.bdetails.bs || '';
  //     this.bsubsector = this.bdetails.bss || '';
  //     if (this.userData.accountType === 'BRANCH' && this.userData.userType !== 2) {
  //       this.branchName = this.bdetails.bn || 'User';
  //       this.bname = this.userData.userName || 'User';
  //       if (this.userDetails.profilePicture) {
  //         this.blogo = this.userDetails.profilePicture;
  //       } else if (this.bdetails.logo) {
  //         this.blogo = this.bdetails.logo;
  //       } else {
  //         this.blogo = '../../../assets/images/img-null.svg';
  //       }
  //     } else {
  //       this.bname = this.bdetails.bn || 'User';
  //       this.blogo = this.bdetails.logo || '../../../assets/images/img-null.svg';
  //     }
  //   }
  // }

}




