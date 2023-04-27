import { Component, OnInit } from '@angular/core';
import { projectConstantsLocal } from '../../../../../../src/app/shared/constants/project-constants';
import { projectConstants } from '../../../../../../src/app/app.component';
import { Messages } from '../../../../../../src/app/shared/constants/project-messages';
import { Location } from '@angular/common';
import { Router, NavigationExtras } from '@angular/router';
import { SnackbarService } from '../../../../../../src/app/shared/services/snackbar.service';
import { CrmService } from '../crm.service';
import { WordProcessor } from '../../../../../../src/app/shared/services/word-processor.service';
import { MatDialog } from '@angular/material/dialog';
import { CrmSelectMemberComponent } from '../../../../../../src/app/business/shared/crm-select-member/crm-select-member.component';
import { GroupStorageService } from '../../../../../../src/app/shared/services/group-storage.service';
import { ProviderServices } from '../../../../../../src/app/business/services/provider-services.service';
@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css']
})
export class TasksComponent implements OnInit {
  tooltipcls = '';
  no_tasks_cap = Messages.AUDIT_NO_TASKS_CAP;
  load_complete = 0;
  api_loading = false;
  newDateFormat = projectConstantsLocal.DATE_MM_DD_YY_FORMAT;
  filterapplied;
  filter_sidebar = false;
  open_filter = false;
  perPage = projectConstants.PERPAGING_LIMIT;
  taskList: any = [];
  filtericonTooltip = '';
  msg = 'Do you really want to mark as done this activity? ';
  public taskStatusList: any = [{
    id: 1, name: 'New', image: './assets/images/crmImages/new.png', count: 0
  },
  {
    id: 5, name: 'Completed', image: './assets/images/crmImages/completed2.png', count: 0
  }];
  public categoryListData: any = [];
  public taskTypeList: any = [];
  types: any = [];
  statuses: any = [];
  categories: any = [];
  filtericonclearTooltip: any;
  public taskMasterList: any = [];
  public arr: any;
  public statusFilter: any = {
    id: 1, name: 'New', image: './assets/images/crmImages/new.png', count: 0
  };
  public totalActivity: any = 'Total activity';
  public headerName: any = 'Activity updation';
  totalTaskActivityList: any = [];
  pagination: any = {
    startpageval: 1,
    totalCnt: 0,
    perPage: this.crmService.PERPAGING_LIMIT
  };
  checkBoxValueSelect: any;
  selected_location: any;
  locations: any;
  tasks: any[];
  config: any;
  taskCount: any = 0;
  newTaskDetailsCount: number = 0;
  completedTaskCount: number = 0;
  selected2: { id: number; name: any; image: any; };
  endminday: any;
  maxday: any;
  server_date: any;
  tomorrowDate: Date;
  yesterdayDate: Date;
  endmaxday: Date;
  createActivityText: string = 'Create Activity';
  Filter: string = 'Filter';
  filterConfig: any = [];
  constructor(
    private locationobj: Location,
    public router: Router,
    private dialog: MatDialog,
    private wordProcessor: WordProcessor,
    private snackbarService: SnackbarService,
    private crmService: CrmService,
    private groupService: GroupStorageService,
    private providerServices: ProviderServices
  ) {
    this.filtericonTooltip = this.wordProcessor.getProjectMesssages('FILTERICON_TOOPTIP');

    this.filterConfig = [
      { field: 'dueDate', title: 'Starting Date', type: 'date', filterType: 'ge' },
      { field: 'dueDate', title: 'Ending Date', type: 'date', filterType: 'le' }
    ]



  }

  ngOnInit() {

    this.getTaskmaster();
    const _this = this;
    this.getLocationList().then(() => {
      this.selected_location = this.locations[0];
      const filter = this.setFilterWithPreDefinedValues();
      this.getNewStatusCount();
      this.getCompletedStatusCount();
      _this.getTotalTaskActivityCount(filter).then(
        (count: any) => {
          this.api_loading = false;
          if (count > 0) {
            this.taskCount = count;
          } else {
            _this.api_loading = false;
          }
        }
      )
    });
  }

  getNewStatusCount() {
    let api_filter = this.setFilterWithPreDefinedValues();
    api_filter['status-eq'] = 1;
    this.getTotalTaskActivityCount(api_filter).then((count: any) => {
      this.taskStatusList[0]['count'] = count;
    })
  }

  getCompletedStatusCount() {
    let api_filter = this.setFilterWithPreDefinedValues();
    api_filter['status-eq'] = 5;
    this.getTotalTaskActivityCount(api_filter).then((count: any) => {
      this.taskStatusList[1]['count'] = count;
      this.statusFilter[0]['count'] = count;
    })
  }

  applyFilters(event) {
    console.log("event", event)
    let api_filter = event;
    let filter = this.setFilterWithPreDefinedValues();
    let finalFilterValues = Object.assign(api_filter, filter);
    console.log("api_filter", api_filter)
    if (finalFilterValues) {
      this.getTotalTaskActivityCount(finalFilterValues).then((count: any) => {
        this.taskCount = count
      })
      this.getTotalTaskActivity(finalFilterValues);
    }
  }

  loadTasks(event) {
    let api_filter = this.crmService.setFiltersFromPrimeTable(event);
    let filter = this.setFilterWithPreDefinedValues();
    let finalFilterValues = Object.assign(api_filter, filter)

    if (finalFilterValues) {
      this.getTotalTaskActivityCount(finalFilterValues).then((count: any) => {
        this.taskCount = count;
      })
      this.getTotalTaskActivity(finalFilterValues);
    }
  }

  getTaskStatusListData() {
    const _this = this;
    return new Promise((resolve, reject) => {
      _this.crmService.getTaskStatus().subscribe((taskStatus: any) => {
        resolve(taskStatus);
      },
        (error) => {
          _this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' })
        })
    })
  }

  compareFn(f1, f2): boolean {
    return f1 && f2 ? f1.id === f2.id : f1 === f2;
  }

  handleTaskStatus(statusValue: any) {
    let filter = this.setFilterWithPreDefinedValues();
    filter['status-eq'] = statusValue;
    this.getTotalTaskActivityCount(filter).then((count: any) => {
      this.taskCount = count;
    })
    filter['from'] = 0;
    filter['count'] = 10;
    this.getTotalTaskActivity(filter)

  }

  getTotalTaskActivity(filter) {
    this.crmService.getTotalTask(filter).subscribe((res: any) => {
      this.totalTaskActivityList = res;
      this.api_loading = false;
    })
  }

  getTotalTaskActivityCount(filter = {}) {
    const _this = this;
    return new Promise((resolve, reject) => {
      _this.crmService.getTotalTaskCount(filter).subscribe((data) => {
        _this.pagination.totalCnt = data;
        resolve(data);
      },
        error => {
          reject(error)
        }
      )
    })
  }

  getColor(status) {
    if (status) {
      if (status === 'New') {
        return '#05CDE9'
      }
      else if (status === 'Assigned') {
        return '#FEDC28';
      }
      else if (status === 'In Progress') {
        return '#FFA439';
      }
      else if (status === 'Cancelled') {
        return '#FF5740';
      }
      else if (status === 'Suspended') {
        return '#FF540B';
      }
      else if (status === 'Completed') {
        return '#38C984';
      }
      else if (status === 'Pending') {
        return 'green';
      }
      else if (status === 'Rejected') {
        return 'green';
      }
      else if (status === 'Proceed') {
        return 'green';
      }
      else if (status === 'Verified') {
        return 'green';
      }
    }
  }

  goback() {
    this.locationobj.back();
  }
  
  viewTask(taskUid, taskData: any) {
    this.crmService.taskToCraeteViaServiceData = taskData;
    this.router.navigate(['/provider/viewtask/' + taskUid]);

  }
  getTaskmaster() {
    this.crmService.getTaskMasterList().subscribe((response: any) => {
      this.taskMasterList.push(response)
    })

  }

  createTask(createText: any) {
    if (this.taskMasterList[0].length > 0) {
      const navigationExtras: NavigationExtras = {
        queryParams: {
          type: 'activityCreateTemplate',
          src: 'updateactivity'
        }
      }
      this.router.navigate(['provider', 'task', 'tasktemplate'], navigationExtras)
    }
    else {
      this.crmService.taskActivityName = 'CreteTaskMaster'
      this.router.navigate(['provider', 'task', 'create-task'])
    }
  }

  setFilterWithPreDefinedValues() {
    let api_filter = {};

    if (this.selected_location && this.selected_location.id) {
      api_filter['location-eq'] = this.selected_location.id;
    }

    if (this.statusFilter && this.statusFilter.id) {
      api_filter['status-eq'] = this.statusFilter.id;
    }

    api_filter['isSubTask-eq'] = false;
    return api_filter;
  }

  openTaskCompletion(taskData: any) {
    const dialogRef = this.dialog.open(CrmSelectMemberComponent, {
      width: '100%',
      panelClass: ['commonpopupmainclass', 'confirmationmainclass'],
      disableClose: true,
      data: {
        requestType: 'taskComplete',
        taskName: taskData,
      }
    });
    dialogRef.afterClosed().subscribe((res) => {
      if (res === 'Completed') {
        this.ngOnInit()
      }
    })

  }
  openDialogStatusChange(taskData: any) {
    const dialogRef = this.dialog.open(CrmSelectMemberComponent, {
      width: '100%',
      panelClass: ['commonpopupmainclass', 'confirmationmainclass'],
      disableClose: true,
      data: {
        requestType: 'statusChange',
        taskDetails: taskData,
      }
    });
    dialogRef.afterClosed().subscribe((res: any) => {
      this.ngOnInit()
    })
  }
  /**
 * Router Navigations
 */
  gotoLocations() {
    this.router.navigate(['provider', 'settings', 'general', 'locations']);
  }
  /**
   * 
   * @param event 
   */
  onChangeLocationSelect(event) {
    const value = event;
    this.selected_location = this.locations[value];
    const filter = this.setFilterWithPreDefinedValues();
    this.getTotalTaskActivityCount(filter).then((count: any) => {
      this.taskCount = count
    });
    this.getTotalTaskActivity(filter);
  }
  /**
   * 
   * @returns 
   */
  getLocationList() {
    this.api_loading = true;
    const self = this;
    const loggedUser = this.groupService.getitemFromGroupStorage('ynw-user');
    return new Promise<void>(function (resolve, reject) {
      self.selected_location = null;
      self.providerServices.getProviderLocations()
        .subscribe(
          (data: any) => {
            const locations = data;
            self.locations = [];
            for (const loc of locations) {
              if (loc.status === 'ACTIVE') {
                if (loggedUser.accountType === 'BRANCH' || loggedUser.adminPrivilege) {
                  const userObject = loggedUser.bussLocs.filter(id => parseInt(id) === loc.id);
                  if (userObject.length > 0) {
                    self.locations.push(loc);
                  }
                } else {
                  self.locations.push(loc);
                }
              }
            }
            resolve();
          },
          () => {
            reject();
          },
          () => {
          }
        );
    },
    );
  }
}