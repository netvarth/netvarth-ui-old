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

@Component({
  selector: 'app-user-service-change',
  templateUrl: './user-service-change.component.html',
  styleUrls: ['./user-service-change.component.css']
})

export class UserServiceChnageComponent implements OnInit {
  accountType: any;
  selected_data_id: number;
  serviceCount: any;
  all_queue_sel: boolean;
  all_schedule_sel: boolean;
  serviceList: any;
  selection_type: any;
  services_selected: any = [];
  services_list: any = [];
  service_cap = Messages.QUEUE_SERVICE_OFFERD_CAP;
  select_All = Messages.SELECT_ALL;
  public service_dataSource = new MatTableDataSource<any>();
  selected_data: any = [];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  service_loading$ = true;
  service_displayedColumns = ['select', 'username', 'userType', 'status'];
  selection = new SelectionModel(true, []);
  queueDetail = false;
  waitlist_id: any;

  constructor(
    private activated_route: ActivatedRoute,
    private router: Router,
    private provider_services: ProviderServices,
    public shared_functions: SharedFunctions,
    private groupService: GroupStorageService,
    private snackbarService: SnackbarService
  ) {
    this.activated_route.params.subscribe(params => {
      this.waitlist_id = params.id;
      console.log(this.waitlist_id);
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
  }

  /** Whether the number of selected elements matches the total number of rows. */
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

  // service related method-------------------------------------------------------->
  setServiceDataSource(result) {
    const service_list: any = [];
    result.forEach(serviceObj => {
      let userName = '';
      userName = serviceObj.firstName + ' ' + serviceObj.lastName;
      service_list.push(
        {
          'id': serviceObj.id,
          'Username': userName,
          'userType': serviceObj.userType,
          'status': serviceObj.status
        });
    });
    return service_list;

  }

  updateUser() {
    this.services_selected = this.selection.selected;
    console.log(this.services_selected)
    const post_data = {
      'ynwUuid': this.waitlist_id,
      'provider': {
          'id': this.services_selected[0].id
      },
    };
    console.log(post_data);
    this.provider_services.updateUserWaitlist(post_data)
            .subscribe(
                data => {
                  console.log(data);
                    this.router.navigate(['provider', 'check-ins']);
                },
                error => {
                    this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
                }
            );
  }
  redirecToReports() {
    this.router.navigate(['provider', 'check-ins']);
  }


}

