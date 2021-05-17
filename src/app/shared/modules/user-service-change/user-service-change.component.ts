// import { Component, OnInit, ViewChild } from '@angular/core';
// import { Messages } from '../../constants/project-messages';
// import { MatTableDataSource } from '@angular/material/table';
// import { MatPaginator } from '@angular/material/paginator';
// import { SelectionModel } from '@angular/cdk/collections';
// import { Router, ActivatedRoute } from '@angular/router';
// import { ProviderServices } from '../../../ynw_provider/services/provider-services.service';
// import { SharedFunctions } from '../../functions/shared-functions';
// import { GroupStorageService } from '../../services/group-storage.service';
// import { SnackbarService } from '../../services/snackbar.service';
// import { MatDialog } from '@angular/material/dialog';
// import { ConfirmBoxComponent } from '../../../ynw_provider/shared/component/confirm-box/confirm-box.component';

// @Component({
//   selector: 'app-user-service-change',
//   templateUrl: './user-service-change.component.html',
//   styleUrls: ['./user-service-change.component.css']
// })

// export class UserServiceChnageComponent implements OnInit {
//   accountType: any;
//   serviceList: any;
//   services_selected: any = [];
//   select_All = Messages.SELECT_ALL;
//   public service_dataSource = new MatTableDataSource<any>();
//   @ViewChild(MatPaginator) paginator: MatPaginator;
//   service_displayedColumns = ['select', 'username', 'userType', 'status'];
//   selection = new SelectionModel(true, []);
//   uuid: any;
//   source;
//   constructor(
//     private activated_route: ActivatedRoute,
//     private router: Router,
//     private provider_services: ProviderServices,
//     public shared_functions: SharedFunctions,
//     private groupService: GroupStorageService,
//     private snackbarService: SnackbarService,
//     private dialog: MatDialog,
//   ) {
//     this.activated_route.params.subscribe(params => {
//       this.uuid = params.id;
//     });
//     this.activated_route.queryParams.subscribe(qparams => {
//       this.source = qparams.source;
//     });
//     const user = this.groupService.getitemFromGroupStorage('ynw-user');
//     this.accountType = user.accountType;
//   }
//   applyFilter(filterValue: string) {
//     this.selection.clear();
//     filterValue = filterValue.trim(); // Remove whitespace
//     filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
//     this.service_dataSource.filter = filterValue;
//   }
//   ngOnInit() {
//     this.getProviders();
//   }
//   getProviders() {
//     const apiFilter = {};
//     apiFilter['userType-eq'] = 'PROVIDER';
//     this.provider_services.getUsers(apiFilter).subscribe(data => {
//       this.service_dataSource.data = this.setServiceDataSource(data);
//     });
//   }
//   isAllSelected() {
//     const numSelected = this.selection.selected.length;
//     const numRows = this.service_dataSource.data.length;
//     return numSelected === numRows;
//   }

//   masterToggle() {
//     this.isAllSelected() ?
//       this.selection.clear() :
//       this.service_dataSource.data.forEach(row => this.selection.select(row));
//   }
//   setServiceDataSource(result) {
//     const service_list: any = [];
//     result.forEach(serviceObj => {
//       let userName = '';
//       userName = serviceObj.firstName + ' ' + serviceObj.lastName;
//       service_list.push(
//         {
//           'id': serviceObj.id,
//           'Username': userName,
//           'userType': serviceObj.userType,
//           'status': serviceObj.status
//         });
//     });
//     return service_list;
//   }
//   updateUser() {
//     this.services_selected = this.selection.selected;
//     let msg = '';
//     msg = 'DO you want change the provider?';
//     const dialogrefd = this.dialog.open(ConfirmBoxComponent, {
//       width: '50%',
//       panelClass: ['commonpopupmainclass', 'confirmationmainclass'],
//       disableClose: true,
//       data: {
//         'message': msg,
//         'type': 'yes/no'
//       }
//     });
//     dialogrefd.afterClosed().subscribe(result => {
//       if (result) {
//         if (this.source == 'checkin') {
//           const post_data = {
//             'ynwUuid': this.uuid,
//             'provider': {
//               'id': this.services_selected[0].id
//             },
//           };
//           this.provider_services.updateUserWaitlist(post_data)
//             .subscribe(
//               data => {
//                 this.router.navigate(['provider', 'check-ins']);
//               },
//               error => {
//                 this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
//               }
//             );

//         }
//         else {
//           const post_data = {
//             'uid': this.uuid,
//             'provider': {
//               'id': this.services_selected[0].id
//             },
//           };
//           this.provider_services.updateUserAppointment(post_data)
//             .subscribe(
//               data => {
//                 this.router.navigate(['provider', 'check-ins']);
//               },
//               error => {
//                 this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
//               }
//             );
//         }
//       }
//     });
//   }
//   redirecToReports() {
//     this.router.navigate(['provider', 'check-ins']);
//   }


// }


import { Component, OnInit, ViewChild } from '@angular/core';
import { Messages } from '../../constants/project-messages';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { SelectionModel } from '@angular/cdk/collections';
import { ActivatedRoute } from '@angular/router';
import { ProviderServices } from '../../../ynw_provider/services/provider-services.service';
import { SharedFunctions } from '../../functions/shared-functions';
import { GroupStorageService } from '../../services/group-storage.service';
import { SnackbarService } from '../../services/snackbar.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmBoxComponent } from '../../../ynw_provider/shared/component/confirm-box/confirm-box.component';
import { WordProcessor } from '../../services/word-processor.service';
import { Location } from '@angular/common';
import { projectConstantsLocal } from '../../constants/project-constants';

@Component({
  selector: 'app-user-service-change',
  templateUrl: './user-service-change.component.html',
  styleUrls: ['./user-service-change.component.css', '../../../../assets/css/style.bundle.css', '../../../../assets/plugins/custom/datatables/datatables.bundle.css', '../../../../assets/plugins/global/plugins.bundle.css', '../../../../assets/plugins/custom/prismjs/prismjs.bundle.css']
})

export class UserServiceChnageComponent implements OnInit {
  accountType: any;
  serviceList: any;
  services_selected: any = [];
  select_All = Messages.SELECT_ALL;
  public service_dataSource = new MatTableDataSource<any>();
  @ViewChild(MatPaginator) paginator: MatPaginator;
  service_displayedColumns = ['select', 'username', 'userType', 'availability', 'phonenumber', 'specialization', 'languages'];
  selection = new SelectionModel(true, []);
  uuid: any;
  source;
  selected = false;
  userId = '';
  selectedUser;
  selectrow = false;
  showDetails: any = [];
  loading = true;
  customer_label = '';
  provider_label = '';
  filter_sidebar = false;
  filterapplied = false;

  filter = {
    firstName: '',
    lastName: '',
    location: '',
    pincode: '',
    primaryMobileNo: ''
  };

  filters: any = {
    'firstName': false,
    'lastName': '',
    'location': false,
    'pincode': false,
    'primaryMobileNo': false
  };
  constructor(
    private activated_route: ActivatedRoute,
    private provider_services: ProviderServices,
    public shared_functions: SharedFunctions,
    private groupService: GroupStorageService,
    private snackbarService: SnackbarService,
    private dialog: MatDialog,
    private wordProcessor: WordProcessor,
    public location: Location,
  ) {
    this.customer_label = this.wordProcessor.getTerminologyTerm('customer');
    this.provider_label = this.wordProcessor.getTerminologyTerm('provider');
    this.activated_route.params.subscribe(params => {
      this.uuid = params.id;
    });
    this.activated_route.queryParams.subscribe(qparams => {
      this.source = qparams.source;
    });
    const user = this.groupService.getitemFromGroupStorage('ynw-user');
    this.accountType = user.accountType;
  }
  applyFilter(filterValue: string) {
    this.selection.clear();
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.service_dataSource.filter = filterValue;
  }
  ngOnInit() {
    this.getProviders();
  }
  getProviders() {
    let apiFilter = {};
    apiFilter = this.setFilterForApi();
    apiFilter['userType-eq'] = 'PROVIDER';
    this.provider_services.getUsers(apiFilter).subscribe(data => {
      this.service_dataSource.data = this.setServiceDataSource(data);
    });
    console.log(this.service_dataSource.data);
    setTimeout(() => {
      this.loading = false;
    }, 500);
  }
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.service_dataSource.data.length;
    return numSelected === numRows;
  }

  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.service_dataSource.data.forEach(row => this.selection.select(row));
  }
  setServiceDataSource(result) {
    const service_list: any = [];
    result.forEach(serviceObj => {
      let userName = '';
      let languages = '';
      let specialization;
      userName = (serviceObj.businessName) ? serviceObj.businessName : serviceObj.firstName + ' ' + serviceObj.lastName;
      if (serviceObj.preferredLanguages) {
        console.log(JSON.parse(serviceObj.preferredLanguages));
        languages = JSON.parse(serviceObj.preferredLanguages);
      }
      if (serviceObj.specialization) {
        specialization = serviceObj.specialization.toString();
        if (serviceObj.specialization.length > 1) {
          specialization = specialization.replace(/,/g, ", ");
        }
      }
      service_list.push(
        {
          'id': serviceObj.id,
          'Username': userName,
          'userType': serviceObj.userType,
          'status': serviceObj.status,
          'mobileNo': serviceObj.mobileNo,
          'isAvailable': serviceObj.isAvailable,
          'specialization': specialization,
          'languages': languages,
          'locationName': serviceObj.locationName,
          'profilePicture': serviceObj.profilePicture
        });
    });
    return service_list;
  }
  updateUser() {
    // this.services_selected = this.selection.selected;
    console.log(this.userId);
    let msg = '';
    msg = 'Do you want to assign this ' + this.customer_label + ' to ' + this.selectedUser.Username + '?';
    const dialogrefd = this.dialog.open(ConfirmBoxComponent, {
      width: '50%',
      panelClass: ['commonpopupmainclass', 'confirmationmainclass'],
      disableClose: true,
      data: {
        'message': msg,
        'type': 'yes/no'
      }
    });
    dialogrefd.afterClosed().subscribe(result => {
      if (result) {
        if (this.source == 'checkin') {
          const post_data = {
            'ynwUuid': this.uuid,
            'provider': {
              'id': this.userId
              // 'id': this.services_selected[0].id
            },
          };
          this.provider_services.updateUserWaitlist(post_data)
            .subscribe(
              data => {
                //this.router.navigate(['provider', 'check-ins']);
                this.location.back();
              },
              error => {
                this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
              }
            );

        }
        else {
          const post_data = {
            'uid': this.uuid,
            'provider': {
              'id': this.userId
              // 'id': this.services_selected[0].id
            },
          };
          this.provider_services.updateUserAppointment(post_data)
            .subscribe(
              data => {
                // this.router.navigate(['provider', 'check-ins']);
                this.location.back();
              },
              error => {
                this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
              }
            );
        }
      }
    });
  }
  redirecToReports() {
    // this.router.navigate(['provider', 'check-ins']);
    this.location.back();
  }
  selectedRow(index, user) {
    this.selectrow = true;
    this.selectedUser = user;
    if (this.selectrow === true && user.id) {
      console.log(user.id)
      this.updateUser()
    }
    this.removeSelection();
    if (this.service_dataSource.data[index].selected === undefined || this.service_dataSource.data[index].selected === false) {
      this.userId = user.id;
      this.service_dataSource.data[index].selected = true;
    } else {
      this.userId = '';
      this.service_dataSource.data[index].selected = false;
    }
  }
  removeSelection() {
    this.service_dataSource.data.map((question) => {
      return question.selected = false;
    });
  }
  getUserImg(user) {
    if (user.profilePicture) {
      const proImage = user.profilePicture;
      return proImage.url;
    } else {
      return '../../.././assets/images/avatar5.png';
    }
  }
  showMoreorLess(event, index, type) {
    event.stopPropagation();
    this.showDetails = [];
    if (type === 'more') {
      this.showDetails[index] = true;
    }
  }
  showFilterSidebar() {
    this.filter_sidebar = true;
  }
  hideFilterSidebar() {
    this.filter_sidebar = false;
    this.clearFilter();
  }
  clearFilter() {
    this.resetFilter();
    this.filterapplied = false;
    this.getProviders();
  }
  resetFilter() {
    this.filters = {
      'firstName': false,
      'lastName': false,
      'location': false,
      'pincode': false,
      'primaryMobileNo': false
    };
    this.filter = {
      firstName: '',
      lastName: '',
      location: '',
      pincode: '',
      primaryMobileNo: ''
    };
  }
  doSearch() {
    this.getProviders();
    if (this.filter.firstName || this.filter.lastName || this.filter.location || this.filter.pincode || this.filter.primaryMobileNo) {
      this.filterapplied = true;
    } else {
      this.filterapplied = false;
    }
  }
  setFilterForApi() {
    const api_filter = {};
    if (this.filter.firstName !== '') {
      api_filter['firstName-eq'] = this.filter.firstName;
    }
    if (this.filter.lastName !== '') {
      api_filter['lastName-eq'] = this.filter.lastName;
    }
    if (this.filter.location !== '') {
      api_filter['locationName-eq'] = this.filter.location;
    }
    if (this.filter.pincode !== '') {
      api_filter['pinCode-eq'] = this.filter.pincode;
    }
    if (this.filter.primaryMobileNo !== '') {
      const pattern = projectConstantsLocal.VALIDATOR_NUMBERONLY;
      const mval = pattern.test(this.filter.primaryMobileNo);
      if (mval) {
        api_filter['primaryMobileNo-eq'] = this.filter.primaryMobileNo;
      } else {
        this.filter.primaryMobileNo = '';
      }
    }
    return api_filter;

  }
  focusInput(ev) {
    const kCode = parseInt(ev.keyCode, 10);
    if (kCode === 13) {
      this.doSearch();
    }
  }
}
