import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Messages } from '../../../../../shared/constants/project-messages';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { ProviderServices } from '../../../../../ynw_provider/services/provider-services.service';
import { SharedFunctions } from '../../../../../shared/functions/shared-functions';
import { ReportDataService } from '../../reports-data.service';
import { GroupStorageService } from '../../../../../shared/services/group-storage.service';
import { SnackbarService } from '../../../../../shared/services/snackbar.service';


@Component({
  selector: 'app-user-selection',
  templateUrl: './user-selection.component.html',
  styleUrls: ['./user-selection.component.css']
})
export class UserSelectionComponent implements OnInit {

  accountType: string;
  selected_data: any = [];
  selected_data_id: any;
  users: any;
  user_list_for_grid: any[];
  reportType: any;
  user_loading$: boolean;
  userCount: any;
  all_user_selected: boolean;
  selection_type: any;
  users_selected: any = [];
  users_list: any = [];
  user_cap = '';
  select_All = Messages.SELECT_ALL;
  public user_dataSource = new MatTableDataSource<any>([]);
  selection = new SelectionModel(true, []);


  displayedColumns = ['select', 'name', 'user', 'status', 'userName'];
  constructor(private router: Router,
    private activated_route: ActivatedRoute,
    private provider_services: ProviderServices,
    public shared_functions: SharedFunctions,
    private report_service: ReportDataService,
    private groupService: GroupStorageService,
    private snackbarService: SnackbarService,
  

  ) {

    this.activated_route.queryParams.subscribe(qparams => {

      const user = this.groupService.getitemFromGroupStorage('ynw-user');
      this.accountType = user.accountType;
   
        this.displayedColumns = ['select', 'name', 'user', 'mobile','email','status'];
     

      this.reportType = qparams.report_type;
      this.selected_data_id = qparams.data;

        if(qparams.data!==undefined){
      const userData: any[] = qparams.data.split(',');
      for (let i = 0; i < userData.length; i++) {
        this.selected_data.push(userData[i]);
      }
    }


      const _this = this;
      this.getAllUsers().then(result => {
        if (parseInt(qparams.data, 0) === 0) {
          console.log(this.user_dataSource.data);
          this.masterToggle();
        }
        if (_this.selected_data.length > 0) {
          _this.user_dataSource.data.forEach(function (row) {
            if (_this.selected_data && _this.selected_data.length > 0) {
              _this.selected_data.forEach(data => {
                // tslint:disable-next-line:radix
                if (parseInt(data) === row.id) {
                  _this.selection.select(row);
                }
              });
            }
          });
        }

      });

    });
  }


  applyFilter(filterValue: string) {

    this.selection.clear();
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.user_dataSource.filter = filterValue;

  }

  ngOnInit() {



  }
  // user related method-------------------------------------------------------->
  setuserDataSource(result) {
    const user_list: any = [];
    result.forEach(userObj => {
      let userName = '';
      if (userObj.provider) {
        userName = userObj.provider.firstName + ' ' + userObj.provider.lastName;
      }
      user_list.push({ 'id': userObj.id, 'name': userObj.name, 'user': userName });

    });
    return user_list;

  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    console.log(numSelected);
    const numRows = this.user_dataSource.data.length;
    console.log(numRows);
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.user_dataSource.data.forEach(row => this.selection.select(row));
  }



  getAllUsers() {
    return new Promise<void>((resolve) => {
      this.provider_services.getUsers()
        .subscribe(
          (data: any) => {
            this.users = data;
        
            this.user_dataSource.data = this.users
            this.userCount = this.user_dataSource.data.length;
            resolve();
          });

    });
  }

   // common method got o previous page------------------------------------->
   passUserSelectedToReports() {
    this.users_selected = this.selection.selected;
    if (this.selection.selected.length === 0) {
      this.snackbarService.openSnackBar('Please select atleast one', { 'panelClass': 'snackbarerror' });
    } else {
      if (this.user_dataSource.filteredData.length < this.selection.selected.length) {
        this.users_selected = this.user_dataSource.filteredData;

      } else if (this.user_dataSource.filteredData.length > this.selection.selected.length) {
        this.users_selected = this.selection.selected;
      }
      if (this.users_selected.length === this.userCount) {
        this.users_selected = 'All';
      }
      if (this.users_selected !== 'All') {
        let user_id = '';
        this.users_selected.forEach(function (user) {
          user_id = user_id + user.id + ',';
        });
        this.users_selected = user_id;
      }
      if (this.users_selected === '') {
        this.users_selected = 'All';
      }
      if (this.users_selected.length === 0) {
        this.snackbarService.openSnackBar('Please select atleast one', { 'panelClass': 'snackbarerror' });
      } else {
        this.report_service.updatedUserDataSelection(this.users_selected);
        this.router.navigate(['provider', 'reports', 'new-report'], { queryParams: { report_type: this.reportType } });
      }
      //
      // }
    }
  }

  redirecToReports() {
    this.router.navigate(['provider', 'reports', 'new-report'], { queryParams: { report_type: this.reportType } });
  }


}
