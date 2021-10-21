import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { SelectionModel } from '@angular/cdk/collections';
import { ActivatedRoute } from '@angular/router';
import { ProviderServices } from '../../../services/provider-services.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmBoxComponent } from '../../../shared/confirm-box/confirm-box.component';
import { Location } from '@angular/common';
import { SharedFunctions } from '../../../../../app/shared/functions/shared-functions';
import { GroupStorageService } from '../../../../../app/shared/services/group-storage.service';
import { SnackbarService } from '../../../../../../src/app/shared/services/snackbar.service';
import { WordProcessor } from '../../../../../app/shared/services/word-processor.service';
import { TeamMembersComponent } from '../../../../../app/shared/modules/assign-team/team-members/team-members.component';
import { Messages } from '../../../../../app/shared/constants/project-messages';


@Component({
  selector: 'app-location-update',
  templateUrl: './location-update.component.html',
  styleUrls: ['./location-update.component.css']
})

export class LocationUpdateComponent implements OnInit {

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
  languages_arr: any = [];
  specialization_arr: any = [];
  user;
  selectedLanguages: any = [];
  selectedGroups: any = [];
  selectedSpecialization: any = [];
  filterApplied_count: any;
  allSelected: boolean;
  availabileSelected: boolean;
  notAvailabileSelected: boolean;
  accountSettings;
  contactDetailsdialogRef: any;
  groups: any;
  users: any = [];
  checkin: any;
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
      if (this.source === 'appt'){
        this.getApptDetails().then(result => {
          this.checkin = result;
          this.getProviderLocations();
        })
      } else if (this.source == 'checkin'){
        this.getCheckinDetails().then(result => {
          this.checkin = result;
          this.getProviderLocations();
        })
      }
    });
    this.user = this.groupService.getitemFromGroupStorage('ynw-user');
    this.accountType = this.user.accountType;
  }
  ngOnInit() {
    this.accountSettings = this.groupService.getitemFromGroupStorage('settings');
    const user = this.groupService.getitemFromGroupStorage('ynw-user');
    this.accountType = user.accountType;
    if (this.accountType === 'BRANCH') {
      this.getUser();
    }
    // this.getProviders();
    // this.getProviderLocations();
  }
  getProviderLocations() {
    this.provider_services.getProviderLocations().subscribe((data: any) => {
      this.service_dataSource.data = this.setServiceDataSource(data);
      this.filterApplied_count = this.service_dataSource.data.length;
      setTimeout(() => {
        this.loading = false;
      }, 500);
    });
  }
  setServiceDataSource(result) {
    const service_list: any = [];
    result.forEach(serviceObj => {
      if((this.source == 'checkin')){
        if(this.checkin.queue.location.id !== serviceObj.id) {
          service_list.push(
            {
              // 'description': serviceObj.description,
              'id': serviceObj.id,
              'name': serviceObj.place,
              // 'size': serviceObj.size ,      
              'status': serviceObj.status,
              // 'users': serviceObj.users
            });
          }
      }
      else{
        if(this.checkin.location.id !== serviceObj.id) {
          service_list.push(
            {
              // 'description': serviceObj.description,
              'id': serviceObj.id,
              'name': serviceObj.place,
              // 'size': serviceObj.size ,      
              'status': serviceObj.status,
              // 'users': serviceObj.users
            });
          }
      }
    });
    return service_list;
  }
  updateUser() {
    let msg = '';
    if (this.selectedUser.status === 'ACTIVE') {
      msg = 'Do you want to assign this ' + this.customer_label + ' to ' + this.selectedUser.name + ' location ?';
    } else {
      msg = this.selectedUser.name + 'seems to be inactive status now. Assign anyway ? ';
    }
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
            'location': {
              'id': this.selectedUser.id
            },
          };
          this.provider_services.updateBusslocWaitlist(post_data)
            .subscribe(
              data => {
                this.snackbarService.openSnackBar('Update location successfully', { 'panelclass': 'snackbarerror' });
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
            'location': {
              'id': this.selectedUser.id
            },
          };
          this.provider_services.updateBusslocApptWaitlist(post_data)
            .subscribe(
              data => {
                this.snackbarService.openSnackBar('Update location successfully', { 'panelclass': 'snackbarerror' });
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
    this.location.back();
  }
  selectedRow(index, user) {
    this.selectrow = true;
    this.selectedUser = user;
    if (this.selectrow === true && user.id) {
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
    } else if (user.gender === 'female') {
      // return '../../.././assets/images/unnamed.png';
      return '../../.././assets/images/avatar5.png';
    }
    else if (user.gender === 'male') {
      return '../../.././assets/images/avatar5.png';
    }
    else {
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
  stopprop(event) {
    event.stopPropagation();
  }
  viewContactDetails(user) {
    this.selectedUser = user;
    // this.getUser();
    this.getUser().then(result => {
      this.contactDetailsdialogRef = this.dialog.open(TeamMembersComponent, {
      width: '50%',
      panelClass: ['popup-class', 'commonpopupmainclass'],
      disableClose: true,
      data: {
        userData: result
      }
    });

    })

    
  }

  getUser() {
    return new Promise((resolve, reject) => {
      const apiFilter = {};
      if (this.selectedUser) {
        apiFilter['businessLocs-eq'] = this.selectedUser.id.toString()
      } else {
        apiFilter['userType-eq'] = 'PROVIDER';
      }
      this.provider_services.getUsers(apiFilter).subscribe(
        (data: any) => {
          // this.users = data;
          resolve(data);
        },
        error => {
          reject(error);
          this.snackbarService.openSnackBar(error.error, { 'panelClass': 'snackbarerror' });
        });
    });
  }
  getApptDetails() {
    return new Promise((resolve, reject) => { 
      this.provider_services.getAppointmentById(this.uuid).subscribe(
        (data: any) => {
          resolve(data);
        },
        error => {
          reject(error);
          this.snackbarService.openSnackBar(error.error, { 'panelClass': 'snackbarerror' });
        });
    });
   }
   getCheckinDetails() {
    return new Promise((resolve, reject) => { 
      this.provider_services.getProviderWaitlistDetailById(this.uuid).subscribe(
        (data: any) => {
          resolve(data);
        },
        error => {
          reject(error);
          this.snackbarService.openSnackBar(error.error, { 'panelClass': 'snackbarerror' });
        });
    });
  }
}