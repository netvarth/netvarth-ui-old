import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SharedFunctions } from '../../../shared/functions/shared-functions';
import { ProviderSharedFuctions } from '../../shared/functions/provider-shared-functions';
import { ProviderServices } from '../../services/provider-services.service';
import { Messages } from '../../../shared/constants/project-messages';

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
            title: Messages.WAITLIST_MANAGE_CAP,
            url: '/provider/settings/waitlist-manager'
        },
        {
            title: 'Departments'
        }
    ];
    isCheckin;

    constructor(public router: Router,
        public shared_functions: SharedFunctions,
        public provider_shared_functions: ProviderSharedFuctions,
        private provider_services: ProviderServices) {

    }
    ngOnInit() {
        this.loading = true;
        this.getDepartments();
        this.breadcrumb_moreoptions = {
            'show_learnmore': true, 'scrollKey': 'checkinmanager->settings-departments', 'subKey': 'timewindow', 'classname': 'b-queue',
            'actions': [{ 'title': 'Add Department', 'type': 'addDepartment' }]
        };
        this.isCheckin = this.shared_functions.getitemfromLocalStorage('isCheckin');
        // this.loading = false;
    }
    gotoDepartmentDetails(dept) {
        this.router.navigate(['provider', 'settings', 'waitlist-manager',
            'department', dept.departmentId]);
    }
    getDepartments() {
        this.loading = false;
        this.provider_services.getDepartments()
            .subscribe(
                data => {
                    this.deptObj = data;
                    this.departments = this.deptObj.departments;
                    this.loading = false;
                },
                error => {
                    this.loading = false;
                    this.shared_functions.apiErrorAutoHide(this, error);
                }
            );
    }
    changeDepartmentStatus(dept) {
        if (dept.departmentStatus === 'ACTIVE') {
            this.provider_services.disableDepartment(dept.departmentId).subscribe(
                () => {
                    this.shared_functions.openSnackBar('Department disabled successfully', { 'panelClass': 'snackbarnormal' });
                    this.getDepartments();
                },
                error => {
                    this.shared_functions.openSnackBar(error, { 'panelClass': 'snackbarerror' });
                }
            );
        } else {
            this.provider_services.enableDepartment(dept.departmentId).subscribe(
                () => {
                    this.shared_functions.openSnackBar('Department enabled successfully', { 'panelClass': 'snackbarnormal' });
                    this.getDepartments();
                },
                error => {
                    this.shared_functions.openSnackBar(error, { 'panelClass': 'snackbarerror' });
                });
        }
    }
    performActions(action) {
        if (action === 'addDepartment') {
            this.router.navigate(['provider', 'settings', 'waitlist-manager',
                'department', 'add']);
        }
    }
}
