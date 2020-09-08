import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Messages } from '../../../../../../shared/constants/project-messages';
import { SharedFunctions } from '../../../../../../shared/functions/shared-functions';
import { ProviderSharedFuctions } from '../../../../../../ynw_provider/shared/functions/provider-shared-functions';
import { ProviderServices } from '../../../../../../ynw_provider/services/provider-services.service';

@Component({
    'selector': 'app-department-list',
    'templateUrl': './department-list.component.html'
})
export class DepartmentListComponent implements OnInit {
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
            title: 'Departments',
            url: '/provider/settings/general/departments'
        },
        {
            title: 'Department List'
        }
    ];
    isCheckin;
    domain: any;

    constructor(public router: Router,
        public shared_functions: SharedFunctions,
        public provider_shared_functions: ProviderSharedFuctions,
        private routerobj: Router,
        private provider_services: ProviderServices) {

    }
    ngOnInit() {
        const user = this.shared_functions.getitemFromGroupStorage('ynw-user');
        this.domain = user.sector;
        this.loading = true;
        this.getDepartments();
        this.breadcrumb_moreoptions = {
            'show_learnmore': true, 'scrollKey': 'general->departments', 'subKey': 'timewindow', 'classname': 'b-queue',
            'actions': [{ 'title': 'Add Department', 'type': 'addDepartment' }, { 'title': 'Help', 'type': 'learnmore' }]
        };
        this.isCheckin = this.shared_functions.getitemFromGroupStorage('isCheckin');
        // this.loading = false;
    }
    gotoDepartmentDetails(dept) {
        this.router.navigate(['provider', 'settings', 'general',
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
                    this.shared_functions.openSnackBar('Department and its services disabled successfully', { 'panelClass': 'snackbarnormal' });
                    this.getDepartments();
                },
                error => {
                    this.shared_functions.openSnackBar(error, { 'panelClass': 'snackbarerror' });
                }
            );
        } else {
            this.provider_services.enableDepartment(dept.departmentId).subscribe(
                () => {
                    this.shared_functions.openSnackBar('Department and its services enabled successfully', { 'panelClass': 'snackbarnormal' });
                    this.getDepartments();
                },
                error => {
                    this.shared_functions.openSnackBar(error, { 'panelClass': 'snackbarerror' });
                });
        }
    }
    performActions(action) {
        if (action === 'addDepartment') {
            this.router.navigate(['provider', 'settings', 'general',
                'department', 'add']);
        } else if (action === 'learnmore') {
            this.routerobj.navigate(['/provider/' + this.domain + '/general->departments']);

        }
    }
    redirecToDepartments() {
        this.router.navigate(['provider', 'settings' , 'general' , 'departments']);
    }
    addDept() {
        this.router.navigate(['provider', 'settings', 'general', 'department', 'add']);
    }
}
