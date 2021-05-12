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
import { Router, ActivatedRoute } from '@angular/router';
import { ProviderServices } from '../../../ynw_provider/services/provider-services.service';
import { SharedFunctions } from '../../functions/shared-functions';
import { GroupStorageService } from '../../services/group-storage.service';
import { SnackbarService } from '../../services/snackbar.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmBoxComponent } from '../../../ynw_provider/shared/component/confirm-box/confirm-box.component';

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
  selectrow = false;
  showDetails: any = [];
  loading = true;
  constructor(
    private activated_route: ActivatedRoute,
    private router: Router,
    private provider_services: ProviderServices,
    public shared_functions: SharedFunctions,
    private groupService: GroupStorageService,
    private snackbarService: SnackbarService,
    private dialog: MatDialog,
  ) {
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
    const apiFilter = {};
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
      userName = (serviceObj.businessName) ? serviceObj.businessName : serviceObj.firstName + ' ' + serviceObj.lastName;
      if (serviceObj.preferredLanguages) {
        console.log(JSON.parse(serviceObj.preferredLanguages));
        languages = JSON.parse(serviceObj.preferredLanguages);
      }

      service_list.push(
        {
          'id': serviceObj.id,
          'Username': userName,
          'userType': serviceObj.userType,
          'status': serviceObj.status,
          'mobileNo': serviceObj.mobileNo,
          'isAvailable': serviceObj.isAvailable,
          'specialization': serviceObj.specialization,
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
    msg = 'Do you want change the provider?';
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
                this.router.navigate(['provider', 'check-ins']);
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
                this.router.navigate(['provider', 'check-ins']);
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
    this.router.navigate(['provider', 'check-ins']);
  }
  selectedRow(index, user) {
    this.selectrow = true;
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
}


