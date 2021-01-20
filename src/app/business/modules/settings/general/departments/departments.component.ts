
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Messages } from '../../../../../shared/constants/project-messages';
import { SharedFunctions } from '../../../../../shared/functions/shared-functions';
import { ProviderSharedFuctions } from '../../../../../ynw_provider/shared/functions/provider-shared-functions';
import { ProviderServices } from '../../../../../ynw_provider/services/provider-services.service';
import { ConfirmBoxComponent } from '../../../../../shared/components/confirm-box/confirm-box.component';
import { MatDialog } from '@angular/material/dialog';
import { GroupStorageService } from '../../../../../shared/services/group-storage.service';
import { WordProcessor } from '../../../../../shared/services/word-processor.service';
import { SnackbarService } from '../../../../../shared/services/snackbar.service';

@Component({
    'selector': 'app-departments',
    'templateUrl': './departments.component.html'
})
export class DepartmentsComponent implements OnInit {
    departments: any = [];
    deptObj;
    breadcrumb_moreoptions: any = [];
    loading = true;
    breadcrumbs = [
        {
            title: 'Settings',
            url: '/provider/settings'
        },
        {
            title: Messages.GENERALSETTINGS,
            url: '/provider/settings/general'
        },
        {
            title: 'Departments'
        }
    ];
    isCheckin;
    domain: any;
    account_type;
    filterbydepartment = false;
    removeitemdialogRef;
    message;
    message1;
    deptstatusstr = 'Off';
    departmentCount;
    constructor(public router: Router,
        public shared_functions: SharedFunctions,
        public provider_shared_functions: ProviderSharedFuctions,
        private routerobj: Router,
        private dialog: MatDialog,
        private provider_services: ProviderServices,
        private groupService: GroupStorageService,
        private wordProcessor: WordProcessor,
        private snackbarService: SnackbarService) {

    }
    ngOnInit() {
        const user = this.groupService.getitemFromGroupStorage('ynw-user');
        this.domain = user.sector;
        this.account_type = user.accountType;
        this.getWaitlistMgr();
        this.getDepartmentsCount();
        this.getDepartments();
        this.breadcrumb_moreoptions = {
            'show_learnmore': true, 'scrollKey': 'general->departments', 'subKey': 'timewindow', 'classname': 'b-queue',
            'actions': [{ 'title': 'Help', 'type': 'learnmore' }]
        };
    }
    learnmore_clicked(mod, e) {
        e.stopPropagation();
        this.router.navigate(['/provider/' + this.domain + '/general->' + mod]);
    }
    getDepartmentsCount() {
        this.provider_services.getDepartmentCount()
            .subscribe(
                data => {
                    this.departmentCount = data;
                });
    }
    doRemoveservice() {
        this.message = 'Assigned services are removed from the departments';
        let params = {};
        if (this.departments.length === 0) {
            if (this.filterbydepartment) {
                this.message = 'To enable department feature, first create a department of your choice.';
                this.message1 = 'Once department is created, all the existing services will be assigned  under the newly created department which you can later reassign with your choice.';
            }
            params = {
                'message': this.message,
                'message1': this.message1,
                'filterByDept': this.filterbydepartment
            };
        } else {
            if (this.filterbydepartment) {
                this.message = 'All services created will be moved to the department named \'Default\'. You can either rename the \'Default\' department for customer visibility or add new departments and assign respective services';
            }
            params = {
                'message': this.message
            };
        }
        this.removeitemdialogRef = this.dialog.open(ConfirmBoxComponent, {
            width: '50%',
            panelClass: ['popup-class', 'commonpopupmainclass', 'confirmationmainclass'],
            disableClose: true,
            data: params
        });
        this.removeitemdialogRef.afterClosed().subscribe(result => {
            if (result) {
                const status = (this.filterbydepartment === true) ? 'Enable' : 'Disable';
                this.provider_services.setDeptWaitlistMgr(status)
                    .subscribe(
                        () => {
                            this.getWaitlistMgr();
                            if (result.deptName) {
                                this.getDepartments(result.deptName);
                            }
                        },
                        error => {
                            this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
                        });
            } else {
                this.filterbydepartment = (this.filterbydepartment === true) ? false : true;
            }
        });
    }
    getDepartments(deptName?) {
        this.loading = false;
        this.provider_services.getDepartments()
            .subscribe(
                data => {
                    this.departments = data;
                    if (deptName) {
                        const params = {
                            'departmentName': deptName,
                            'departmentDescription': this.departments.departments[0].departmentDescription,
                            'departmentCode': this.departments.departments[0].departmentCode,
                            'id': this.departments.departments[0].departmentId
                        };
                        this.updateDepartment(params);
                    }
                },
                error => {
                    this.wordProcessor.apiErrorAutoHide(this, error);
                }
            );
    }
    updateDepartment(post_data) {
        this.provider_services.updateDepartment(post_data)
            .subscribe(
                () => {
                    // this.getDepartmentDetails();
                },
                error => {
                    this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
                }
            );
    }

    getWaitlistMgr() {
        this.provider_services.getWaitlistMgr()
            .subscribe(
                data => {
                    this.filterbydepartment = data['filterByDept'];
                    this.deptstatusstr = data['filterByDept'] ? 'On' : 'Off';
                });
    }
    goDepartments() {
        this.router.navigate(['provider', 'settings', 'general', 'departments', 'list']);
    }
    performActions(action) {
        if (action === 'addDepartment') {
            this.router.navigate(['provider', 'settings', 'general',
                'department', 'add']);
        } else if (action === 'learnmore') {
            this.routerobj.navigate(['/provider/' + this.domain + '/general->departments']);
        }
    }
    redirecToGeneral() {
        this.router.navigate(['provider', 'settings' , 'general']);
    }
    redirecToHelp() {
        this.routerobj.navigate(['/provider/' + this.domain + '/general->departments']);
    }
}
