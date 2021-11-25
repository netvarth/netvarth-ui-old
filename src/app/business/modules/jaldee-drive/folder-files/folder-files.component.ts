import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';

import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { PreviewuploadedfilesComponent } from '../previewuploadedfiles/previewuploadedfiles.component';
import { LocalStorageService } from '../../../../shared/services/local-storage.service';
import { ProviderServices } from '../../../../business/services/provider-services.service';
export let projectConstants: any = {};



@Component({
  selector: 'app-folder-files',
  templateUrl: './folder-files.component.html',
  styleUrls: ['./folder-files.component.css']
})
export class FolderFilesComponent implements OnInit {
  customers: any[] = [];
  loading = true;
  api_loading: boolean;
  selectedTeam;
  addUser = false;
  tooltipcls = '';

  foldertype: any;
  foldername: any;
  fileviewdialogRef: any;
  filter_sidebar = false;
  filterapplied = false;
  filter = {
    fileSize: '',
    fileName: '',
    fileType: '',
    // checkinEncId: '',
    contextId : '',
    folderName: '',
    page_count: projectConstants.PERPAGING_LIMIT,
    page: 1
  };
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



  constructor(
    private _location: Location,
    private provider_servicesobj: ProviderServices,
    private activated_route: ActivatedRoute,
    public dialog: MatDialog,
    private lStorageService: LocalStorageService,

  ) {
    this.activated_route.queryParams.subscribe(params => {
      this.foldertype = params.foldername;
      this.foldername = this.foldertype + ' ' + 'folder';
    });
    this.config = {
      itemsPerPage: 5,
      currentPage: 1,
      totalItems: this.customers.length
    };
  }
  pageChanged(event) {
    this.config.currentPage = event;
  }

  ngOnInit() {
    this.getfiles();
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
    //this.getfiles();
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
      contextId : '',
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

  getfiles() {
    const filter = {};
    console.log(this.foldertype);
    if (this.foldertype === 'private') {
      filter['folderName-eq'] = 'private';
    }
    else if(this.foldertype === 'public')  {
      filter['folderName-eq'] = 'public';

    }
    else{
      filter['folderName-eq'] = 'shared';
    }
  

    console.log(filter);
    this.provider_servicesobj.getAllFilterAttachments(filter).subscribe(
      (data: any) => {
        console.log(data);
        // this.Allfiles = data;
        this.customers = data
        console.log("Uploaded Files : ",this.customers);
      }
    );


  }

  onCancel() {

    this._location.back();

  }

}
