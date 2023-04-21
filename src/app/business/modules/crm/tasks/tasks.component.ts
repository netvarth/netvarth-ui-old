import { Component, OnInit } from '@angular/core';
import { projectConstantsLocal } from '../../../../../../src/app/shared/constants/project-constants';
import { projectConstants } from '../../../../../../src/app/app.component';
import { Messages } from '../../../../../../src/app/shared/constants/project-messages';
import { Location } from '@angular/common';
import { Router, NavigationExtras } from '@angular/router';
import { SnackbarService } from '../../../../../../src/app/shared/services/snackbar.service';
import { CrmService } from '../crm.service';
import { WordProcessor } from '../../../../../../src/app/shared/services/word-processor.service';
// import { LocalStorageService } from '../../../../../../src/app/shared/services/local-storage.service';
import { MatDialog } from '@angular/material/dialog';
import { CrmSelectMemberComponent } from '../../../../../../src/app/business/shared/crm-select-member/crm-select-member.component';
import { GroupStorageService } from '../../../../../../src/app/shared/services/group-storage.service';
import { ProviderServices } from '../../../../../../src/app/business/services/provider-services.service';
// import { DateTimeProcessor } from '../../../../../../src/app/shared/services/datetime-processor.service';
// import { SharedServices } from '../../../../../../src/app/shared/services/shared-services';
// import * as moment from 'moment';
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
    // private lStorageService: LocalStorageService,
    private wordProcessor: WordProcessor,
    private snackbarService: SnackbarService,
    private crmService: CrmService,
    private groupService: GroupStorageService,
    private providerServices: ProviderServices,
    // private dateTimeProcessor: DateTimeProcessor,
    // private shared_services: SharedServices,
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
            // this.config.totalItems = count;
            this.taskCount = count;
            //  this.getTotalTaskActivity(filter)
            // _this.getNewTask(filter);
          } else {
            _this.api_loading = false;
          }
        }
      )
    });

    // this.handleStatus();
    // this.setSystemDate();
    // this.server_date = this.lStorageService.getitemfromLocalStorage('sysdate');
    // if (this.server_date) {
    //   this.getTomorrowDate();
    //   this.getYesterdayDate();
    // }
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

  // getTomorrowDate() {
  //   const server = this.server_date.toLocaleString(this.dateTimeProcessor.REGION_LANGUAGE, { timeZone: this.dateTimeProcessor.TIME_ZONE_REGION });
  //   const serverdate = moment(server).format();
  //   const servdate = new Date(serverdate);
  //   this.tomorrowDate = new Date(moment(new Date(servdate)).add(+1, 'days').format('YYYY-MM-DD'));
  // }
  // getYesterdayDate() {
  //   const server = this.server_date.toLocaleString(this.dateTimeProcessor.REGION_LANGUAGE, { timeZone: this.dateTimeProcessor.TIME_ZONE_REGION });
  //   const serverdate = moment(server).format();
  //   const servdate = new Date(serverdate);
  //   this.yesterdayDate = this.maxday = this.endmaxday = new Date(moment(new Date(servdate)).add(-1, 'days').format('YYYY-MM-DD'));
  // }

  // pageChanged(event) {
  //   this.config.currentPage = event;
  // }
  /**
 * 
 * @returns 
 */
  // setFilter() {
  //   let filter = this.handleTaskStatus(this.statusFilter);
  //   filter['location-eq'] = this.selected_location.id;
  //   if (this.filter.check_in_start_date != null) {
  //     filter['dueDate-ge'] = moment(this.filter.check_in_start_date).format("YYYY-MM-DD");
  //   }
  //   if (this.filter.check_in_end_date != null) {
  //     filter['dueDate-le'] = moment(this.filter.check_in_end_date).format("YYYY-MM-DD");
  //   }
  //   return filter;
  // }
  // setSystemDate() {
  //   this.shared_services.getSystemDate()
  //     .subscribe(
  //       res => {
  //         this.server_date = res;
  //         this.lStorageService.setitemonLocalStorage('sysdate', res);
  //       });
  // }


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




  // handleStatus() {
  //   const _this = this;
  //   const filter = this.handleTaskStatus(this.statusFilter);
  //   this.getTaskStatusListData().then(
  //     (statuses: any) => {
  //       _this.statuses = statuses;
  //       _this.getNewTaskCount(filter).then(
  //         (count: any) => {
  //           this.config.totalItems = count;
  //           if (count > 0) {
  //             this.config.totalItems = count;
  //             _this.getNewTask(filter);
  //           } else {
  //             _this.api_loading = false;
  //           }
  //         }
  //       )
  //       _this.getCompletedTaskCount(filter);
  //     }
  //   )
  // }


  loadTasks(event) {
    // this.getTotalTaskActivityCount().then((count: any) => {
    //   this.taskCount = count;
    // })
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
  // handle_pageclick(pg, statusValue) {
  //   // console.log('statusValue', statusValue)
  //   this.pagination.startpageval = pg;
  //   this.filter.page = pg;
  //   // console.log('this.pagination.startpageval', this.pagination.startpageval)
  //   const filter = this.handleTaskStatus(statusValue);
  //   if (statusValue === 0) {
  //     this.api_loading = true
  //     this.getTotalTaskActivity(filter)
  //   }
  //   else if (statusValue === 1) {
  //     this.api_loading = true
  //     this.getNewTask(filter)
  //   }
  //   else if (statusValue === 2) {
  //     this.api_loading = true
  //     this.getAssignedTask(filter)
  //   }
  //   else if (statusValue === 4) {
  //     this.api_loading = true
  //     this.getCancelledTask(filter)
  //   }
  //   else if (statusValue === 12) {
  //     this.api_loading = true;
  //     this.getSuspendedTask(filter)
  //   }
  //   else if (statusValue === 3) {
  //     this.api_loading = true;
  //     this.getInprogressTask(filter)
  //   }
  //   else if (statusValue === 5) {
  //     this.api_loading = true;
  //     this.getCompletedTask(filter)
  //   }
  //   else if (statusValue === 13) {
  //     this.api_loading = true;
  //     this.getPendingTask(filter)
  //   }
  //   else if (statusValue === 14) {
  //     this.api_loading = true;
  //     this.getRejectedTask(filter)
  //   }
  //   else if (statusValue === 15) {
  //     this.api_loading = true;
  //     this.getProceedTask(filter)
  //   }
  //   else if (statusValue === 16) {
  //     this.api_loading = true;
  //     this.getVerifiedTask(filter)
  //   }

  // }
  // getNewTask(filter) {
  //   // console.log("filter", filter)
  //   this.getNewTaskCount(filter).then(
  //     (count: any) => {
  //       if (count > 0) {
  //         this.newTaskDetailsCount = count
  //         this.crmService.getNewTask(filter)
  //           .subscribe(
  //             data => {
  //               // console.log('dataNewTask',data)
  //               this.config.totalItems = count;
  //               this.totalTaskActivityList = data;
  //               this.api_loading = false;
  //               // console.log('totalTaskActivityList', this.totalTaskActivityList)
  //             },
  //             error => {
  //               this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
  //             }
  //           );
  //       } else {
  //         this.totalTaskActivityList = [];
  //         this.api_loading = false;
  //       }
  //     }
  //   )

  // }
  // getNewTaskCount(filter) {
  //   return new Promise((resolve, reject) => {
  //     this.crmService.getNewTaskCount(filter)
  //       .subscribe(
  //         data => {
  //           this.pagination.totalCnt = data;
  //           resolve(data);
  //         },
  //         error => {
  //           reject(error);
  //         }
  //       );
  //   });
  // }
  // getAssignedTask(filter) {
  //   this.crmService.getAssignedTask(filter)
  //     .subscribe(
  //       data => {
  //         this.totalTaskActivityList = data;
  //         // console.log('assignedTaskList', this.totalTaskActivityList);
  //         this.api_loading = false;
  //       },
  //       error => {
  //         this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });

  //       }
  //     );
  // }
  // getAssigneedTaskCount(filter) {
  //   return new Promise((resolve, reject) => {
  //     this.crmService.getAssigneedTaskCount(filter)
  //       .subscribe(
  //         data => {
  //           this.pagination.totalCnt = data;
  //           resolve(data);
  //         },
  //         error => {
  //           reject(error);
  //         }
  //       );
  //   });
  // }
  // getCancelledTask(filter) {
  //   this.crmService.getCancelledTask(filter)
  //     .subscribe(
  //       data => {
  //         this.totalTaskActivityList = data;
  //         this.api_loading = false;
  //         // console.log('totalTaskActivityList', this.totalTaskActivityList)
  //       },
  //       error => {
  //         this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
  //       }
  //     );
  // }
  // getCancelledTaskCount(filter) {
  //   return new Promise((resolve, reject) => {
  //     this.crmService.getCancelledTaskCount(filter)
  //       .subscribe(
  //         data => {
  //           this.pagination.totalCnt = data;
  //           resolve(data);
  //         },
  //         error => {
  //           reject(error);
  //         }
  //       );
  //   });
  // }
  // getSuspendedTask(filter) {
  //   this.crmService.getSuspendedTask(filter)
  //     .subscribe(
  //       data => {
  //         this.totalTaskActivityList = data;
  //         this.api_loading = false;
  //         // console.log('totalTaskActivityList', this.totalTaskActivityList)
  //       },
  //       error => {
  //         this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
  //       }
  //     );

  // }
  // getSuspendedTaskCount(filter) {
  //   return new Promise((resolve, reject) => {
  //     this.crmService.getSuspendedTaskCount(filter)
  //       .subscribe(
  //         data => {
  //           this.pagination.totalCnt = data;
  //           resolve(data);
  //         },
  //         error => {
  //           reject(error);
  //         }
  //       );
  //   });
  // }
  // getInprogressTask(filter) {
  //   this.crmService.getInprogressTask(filter)
  //     .subscribe(
  //       data => {
  //         // console.log('data', data)
  //         this.totalTaskActivityList = data;
  //         this.api_loading = false;
  //       },
  //       error => {
  //         this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
  //       }
  //     );
  // }
  // getInprogressTaskCount(filter) {
  //   return new Promise((resolve, reject) => {
  //     this.crmService.getInprogressTaskCount(filter)
  //       .subscribe(
  //         data => {
  //           this.pagination.totalCnt = data;
  //           resolve(data);
  //         },
  //         error => {
  //           reject(error);
  //         }
  //       );
  //   });
  // }
  // getCompletedTask(filter) {
  //   this.getCompletedTaskCount(filter).then(
  //     (count: any) => {
  //       // console.log("taskcount", count)
  //       if (count > 0) {
  //         this.completedTaskCount = count;
  //         this.crmService.getCompletedTask(filter)
  //           .subscribe(
  //             data => {
  //               // console.log('dataCompleted', data)
  //               this.config.totalItems = count;
  //               this.totalTaskActivityList = data;
  //               this.api_loading = false;
  //             },
  //             error => {
  //               this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
  //             }
  //           );
  //       } else {
  //         this.totalTaskActivityList = [];
  //         this.api_loading = false;
  //       }
  //     }
  //   )

  // }
  // getCompletedTaskCount(filter) {
  //   return new Promise((resolve, reject) => {
  //     this.crmService.getCompletedTaskCount(filter)
  //       .subscribe(
  //         (data: any) => {
  //           this.completedTaskCount = data;
  //           this.pagination.totalCnt = data;
  //           resolve(data);
  //         },
  //         error => {
  //           reject(error);
  //         }
  //       );
  //   });
  // }
  // getPendingTask(filter) {
  //   this.crmService.getPendingTask(filter)
  //     .subscribe(
  //       data => {
  //         // console.log('data', data)
  //         this.totalTaskActivityList = data;
  //         this.api_loading = false;
  //       },
  //       error => {
  //         this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
  //       }
  //     );
  // }
  // getPendingTaskCount(filter) {
  //   return new Promise((resolve, reject) => {
  //     this.crmService.getPendingTaskCount(filter)
  //       .subscribe(
  //         data => {
  //           this.pagination.totalCnt = data;
  //           resolve(data);
  //         },
  //         error => {
  //           reject(error);
  //         }
  //       );
  //   });
  // }
  // getRejectedTask(filter) {
  //   this.crmService.getRejectedTask(filter)
  //     .subscribe(
  //       data => {
  //         // console.log('data', data)
  //         this.totalTaskActivityList = data;
  //         this.api_loading = false;
  //       },
  //       error => {
  //         this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
  //       }
  //     );
  // }
  // getRejectedTaskCount(filter) {
  //   return new Promise((resolve, reject) => {
  //     this.crmService.getRejectedTaskCount(filter)
  //       .subscribe(
  //         data => {
  //           this.pagination.totalCnt = data;
  //           resolve(data);
  //         },
  //         error => {
  //           reject(error);
  //         }
  //       );
  //   });
  // }
  // getProceedTask(filter) {
  //   this.crmService.getProceedTask(filter)
  //     .subscribe(
  //       data => {
  //         // console.log('data', data)
  //         this.totalTaskActivityList = data;
  //         this.api_loading = false;
  //       },
  //       error => {
  //         this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
  //         // this.loadComplete3 = true;

  //       }
  //     );
  // }
  // getProceedTaskCount(filter) {
  //   return new Promise((resolve, reject) => {
  //     this.crmService.getRejectedTaskCount(filter)
  //       .subscribe(
  //         data => {
  //           this.pagination.totalCnt = data;
  //           resolve(data);
  //         },
  //         error => {
  //           reject(error);
  //         }
  //       );
  //   });
  // }
  // getVerifiedTask(filter) {
  //   this.crmService.getVerifiedTask(filter)
  //     .subscribe(
  //       data => {
  //         // console.log('data', data)
  //         this.totalTaskActivityList = data;
  //         this.api_loading = false;
  //       },
  //       error => { this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' }) });
  // }
  // getVerifiedTaskCount(filter) {
  //   return new Promise((resolve, reject) => {
  //     this.crmService.getVerifiedTaskCount(filter)
  //       .subscribe(
  //         data => {
  //           this.pagination.totalCnt = data;
  //           resolve(data);
  //         },
  //         error => {
  //           reject(error);
  //         }
  //       );
  //   });
  // }
  // applyFilter(status) {
  //   this.endminday = this.filter.check_in_start_date;
  //   if (this.filter.check_in_end_date) {
  //     this.maxday = this.filter.check_in_end_date;
  //   } else {
  //     this.maxday = this.yesterdayDate;
  //   }
  //   const filter = {}
  //   // console.log(this.dateTimeProcessor.transformToYMDFormat(this.filter.check_in_start_date))
  //   filter['location-eq'] = this.selected_location.id;
  //   if (this.filter.check_in_start_date != null) {
  //     filter['dueDate-ge'] = moment(this.filter.check_in_start_date).format("YYYY-MM-DD");
  //   }
  //   if (this.filter.check_in_end_date != null) {
  //     filter['dueDate-le'] = moment(this.filter.check_in_end_date).format("YYYY-MM-DD");
  //   }
  //   if (this.statusFilter == 1) {
  //     this.getNewTask(filter);
  //   }
  //   else if (this.statusFilter == 5) {
  //     this.getCompletedTask(filter)
  //   }
  //   // console.log(status);
  //   this.handleTaskStatus(this.checkBoxValueSelect)
  //   this.filter_sidebar = false;
  // }

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
  // doSearch() {
  //   this.lStorageService.removeitemfromLocalStorage('taskfilter');
  //   if (this.filter.status || this.filter.category || this.filter.type || this.filter.dueDate) {
  //     this.filterapplied = true;
  //   } else {
  //     this.filterapplied = false;
  //   }
  // }
  // toggleFilter() {
  //   this.open_filter = !this.open_filter;
  // }
  // showFilterSidebar() {
  //   this.filter_sidebar = true;
  // }
  // hideFilterSidebar() {
  //   this.filter_sidebar = false;
  // }
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
      // console.log('kkkk')
      this.crmService.taskActivityName = 'CreteTaskMaster'
      this.router.navigate(['provider', 'task', 'create-task'])
    }
  }
  // stopprop(event) {
  //   event.stopPropagation();
  // }
  // openEditTask(taskdata: any, editText: any) {
  //   this.crmService.taskToCraeteViaServiceData = taskdata
  //   const newTaskData = this.crmService.taskToCraeteViaServiceData
  //   setTimeout(() => {
  //     this.crmService.taskActivityName = editText;
  //     newTaskData;
  //     this.router.navigate(['provider', 'task', 'create-task']);
  //   }, projectConstants.TIMEOUT_DELAY);

  // }

  // keyPressed() {
  //   // console.log("this.filter",this.filter)
  //   if (this.filter.check_in_start_date || this.filter.check_in_end_date
  //     || this.statuses.length > 0 || this.categories.length > 0 || this.types.length > 0) {
  //     this.filterapplied = true;
  //   } else {
  //     this.filterapplied = false;
  //   }
  // }
  // setFilterForApi() {
  //   const api_filter = {};

  //   if (this.statuses.length > 0) {
  //     api_filter['status-eq'] = this.statuses.toString();
  //   }
  //   if (this.types.length > 0) {
  //     api_filter['type-eq'] = this.types.toString();
  //   }
  //   if (this.categories.length > 0) {
  //     api_filter['category-eq'] = this.categories.toString();
  //   }
  //   if (this.filter.title !== '') {
  //     api_filter['title-eq'] = this.filter.title;
  //   }
  //   if (this.filter.check_in_start_date != null) {
  //     api_filter['date-ge'] = this.dateTimeProcessor.transformToYMDFormat(this.filter.check_in_start_date);
  //   }
  //   if (this.filter.check_in_end_date != null) {
  //     api_filter['date-le'] = this.dateTimeProcessor.transformToYMDFormat(this.filter.check_in_end_date);
  //   }
  //   // console.log(api_filter)
  //   return api_filter;
  // }
  // setFilterDataCheckbox(type, value?, event?) {
  //   // console.log('type', type)
  //   // console.log('value', value)
  //   if (type === 'status') {
  //     this.checkBoxValueSelect = value;
  //   }
  //   if (type === 'type') {
  //     const indx = this.types.indexOf(value);
  //     this.types = [];
  //     if (indx === -1) {
  //       this.types.push(value);
  //     }
  //   }
  //   if (type === 'category') {
  //     const indx = this.categories.indexOf(value);
  //     this.categories = [];
  //     if (indx === -1) {
  //       this.categories.push(value);
  //     }
  //   }
  //   this.keyPressed()
  // }


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

  // clearFilter() {
  //   this.statuses = [];
  //   this.types = [];
  //   this.categories = [];
  //   // console.log("this.statusFilter",this.statusFilter)
  //   this.handleTaskStatus(this.statusFilter)
  //   this.filterapplied = false;
  // }


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
      // console.log('resssssssssCom', res);
      if (res === 'Completed') {
        this.ngOnInit()
      }
    })

  }
  openDialogStatusChange(taskData: any) {
    // console.log('openDialogStatusChange', taskData)
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
      // console.log('resssssssss', res);
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
    // const _this = this;
    const value = event;
    this.selected_location = this.locations[value];
    const filter = this.setFilterWithPreDefinedValues();
    this.getTotalTaskActivityCount(filter).then((count: any) => {
      this.taskCount = count
    });
    this.getTotalTaskActivity(filter);

    // console.log("filter", filter)
    // if (this.statusFilter == 1) {
    //   _this.getNewTaskCount(filter).then(
    //     (count: any) => {
    //       // console.log("taskcount", count)
    //       this.taskCount = count;
    //       if (count > 0) {
    //         _this.getNewTask(filter);
    //       } else {
    //         _this.api_loading = false;
    //       }
    //     }
    //   )
    // }
    // else {
    //   _this.getCompletedTaskCount(filter).then(
    //     (count: any) => {
    //       // console.log("taskcount", count)
    //       this.taskCount = count;
    //       if (count > 0) {
    //         _this.getCompletedTask(filter);
    //       } else {
    //         _this.api_loading = false;
    //       }
    //     }
    //   )
    // }

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