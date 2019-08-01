import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ProviderServices } from '../../../../ynw_provider/services/provider-services.service';
import { SharedFunctions } from '../../../../shared/functions/shared-functions';
import { ConfirmBoxComponent } from '../../../shared/component/confirm-box/confirm-box.component';
import { Messages } from '../../../../shared/constants/project-messages';
import { MatDialog } from '@angular/material';
import { FormBuilder, FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';
// import { SelectAutocompleteComponent } from 'mat-select-autocomplete';
// import { ChangeDetectionStrategy } from '@angular/compiler/src/core';
@Component({
    // 'changeDetection': ChangeDetectionStrategy.OnPush,
    'selector': 'app-department-details',
    'templateUrl': './department-details.component.html'
})
export class DepartmentDetailComponent implements OnInit {
    // @ViewChild(SelectAutocompleteComponent) multiSelect: SelectAutocompleteComponent;
    dept_data;
    dept_id;
    breadcrumbs_init = [
        {
            title: 'Settings',
            url: '/provider/settings'
        },
        {
            title: Messages.WAITLIST_MANAGE_CAP,
            url: '/provider/settings/waitlist-manager'
        },
        {
            title: 'Departments',
            url: '/provider/settings/waitlist-manager/departments'
        }
    ];
    breadcrumbs = this.breadcrumbs_init;
    selected_action = 'show';
    isCheckin;
    add_it_now_show = false;
    dept_services: any = [];
    defaultdepartmentservice: any = [];
    selected_services: any = [];
    services_all: any = [];
    deptServices = new FormControl();
    add_it_cap = Messages.BPROFILE_ADD_IT_NOW_CAP;
    showAllServices = false;
    servicesjson: any = [];
    srvcArry: any = [];
    showServc = true;
    loading = true;
    departlist;
    removeitemdialogRef;
    deptObj: ArrayBuffer;
    departments: any;
    constructor(private changeDetectorRef: ChangeDetectorRef,
        private router: Router,
        private dialog: MatDialog,
        private provider_services: ProviderServices,
        private shared_Functionsobj: SharedFunctions,
        private activated_route: ActivatedRoute,
        private fb: FormBuilder) {
        this.activated_route.params.subscribe(params => {
            this.dept_id = params.id;
        });
    }
    ngOnInit() {
        this.loading = true;
        this.getServices();
        this.getDepartments();
        if (this.dept_id === 'add') {
            this.dept_id = null;
            this.showServc = false;
        }
        if (this.dept_id) {
            this.getDepartmentDetails();
        } else {
            this.selected_action = 'add';
        }
        this.isCheckin = this.shared_Functionsobj.getitemfromLocalStorage('isCheckin');
        // this.loading = false;
    }
    checkServiceExists(name) {
        if (this.selected_services.length > 0) {
            const isExists = this.selected_services.indexOf(name);
            if (isExists !== -1) {
                return true;
            }
        } else {
            return false;
        }
    }
    serviceSelected(sel_service) {
        if (this.selected_services.length > 0) {
            const existindx = this.selected_services.indexOf(sel_service);
            if (existindx === -1) {
                this.selected_services.push(sel_service);
            } else {
                this.selected_services.splice(existindx, 1);
            }
        } else {
            this.selected_services.push(sel_service);
        }
    }
    cancelAssignServices() {
        this.showAllServices = false;
    }
    removeServiceFromDept(service, index, sel_service) {
        this.removeitemdialogRef = this.dialog.open(ConfirmBoxComponent, {
            width: '50%',
            panelClass: ['popup-class', 'commonpopupmainclass', 'confirmationmainclass'],
            disableClose: true,
            data: {
                'message': 'Do you really want to remove the service?'
            }
        });
        this.removeitemdialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.provider_services.removeDeparmentService(this.dept_id, service.id).subscribe(
                    (data) => {
                        this.dept_services.splice(index, 1);
                    }
                );
            }
        });
    }
    assignServices(services) {
        const input = {};
        const serviceIds = [];
        for (let index = 0; index < services.length; index++) {
            serviceIds.push(services[index].id);
        }
        input['serviceIds'] = serviceIds;
        this.provider_services.addDepartmentServices(input, this.dept_id).subscribe(
            (data) => {
                this.shared_Functionsobj.openSnackBar('Services added successfully', { 'panelClass': 'snackbarnormal' });
                this.getDepartmentDetails();
                this.add_it_now_show = true;
                this.showAllServices = false;
            },
            (error) => {
                this.shared_Functionsobj.openSnackBar(error, { 'panelClass': 'snackbarerror' });
            }
        );
    }
    handleActionPerformed(form_data) {
        if (form_data.department) {
            const post_itemdata2 = form_data.department;
            if (form_data.action === 'add') {
                this.createDepartment(post_itemdata2);
            } else if (form_data.action === 'edit') {
                post_itemdata2.id = this.dept_id;
                this.updateDepartment(post_itemdata2);
            } else if (form_data.action === 'changestatus') {
                // this.changeServiceStatus(this.service_data);
            }
        } else {
            if (form_data.action === 'edit') {
                this.selected_action = 'edit';
                this.changeDetectorRef.detectChanges();
            } else if (form_data.action === 'close' && form_data.source !== 'add') {
                this.selected_action = 'show';
                this.changeDetectorRef.detectChanges();
            } else {
                this.router.navigate(['provider/settings/waitlist-manager/departments']);
            }
        }
    }
    createDepartment(post_data) {
        this.provider_services.createDepartment(post_data)
            .subscribe(
                (id) => {
                    this.dept_id = id;
                    this.getDepartmentDetails();
                },
                error => {
                    this.shared_Functionsobj.openSnackBar(error, { 'panelClass': 'snackbarerror' });
                }
            );
        this.showServc = true;
    }
    getServices() {
        this.loading = true;
        return new Promise((resolve, reject) => {
            this.provider_services.getServicesList()
                .subscribe(
                    data => {
                        this.servicesjson = data;
                        const services = [];
                        for (let index = 0; index < this.servicesjson.length; index++) {
                            if (this.servicesjson[index].status === 'ACTIVE') {
                                services.push(this.servicesjson[index]);
                            }
                        }
                        this.services_all = this.shared_Functionsobj.sortByKey(services, 'name');
                        resolve();
                        this.loading = false;
                    },
                    error => {
                        this.loading = false;
                        this.shared_Functionsobj.apiErrorAutoHide(this, error);
                        reject(error);
                    }
                );
        });
    }
    deptclicked() {
        const a = document.getElementsByClassName('mat-select-panel');
        for (let i = 0; i < a.length; i++) {
            a[i].classList.add('depts_details');
        }
    }
    editLocationServices() {
        this.srvcArry = [];
        // this.srvcArry = this.services_all.filter(item1 =>
        //     !this.defaultdepartmentservice.some(item2 => (item2.id === item1.id)))
        this.srvcArry = this.defaultdepartmentservice;
        this.showAllServices = true;
    }
    getDepartmentDetails() {
        this.loading = true;
        this.getServices().then(
            res => {
                this.provider_services.getDepartmentById(this.dept_id)
                    .subscribe(
                        data => {
                            this.add_it_now_show = true;
                            this.dept_data = data;
                            this.dept_services = this.dept_data.serviceIds;
                            this.selected_action = 'show';
                            const breadcrumbs = [];
                            this.breadcrumbs_init.map((e) => {
                                breadcrumbs.push(e);
                            });
                            breadcrumbs.push({
                                title: this.dept_data.departmentName
                            });
                            this.breadcrumbs = breadcrumbs;
                            const newserviceArray = [];
                            for (let i = 0; i < this.servicesjson.length; i++) {
                                for (let j = 0; j < this.dept_services.length; j++) {
                                    if (this.dept_services[j] === this.servicesjson[i].id) {
                                        newserviceArray.push(this.servicesjson[i]);
                                    }
                                }
                            }
                            this.dept_services = newserviceArray;
                            this.loading = false;
                        },
                        () => {
                            this.loading = false;
                            // this.goBack();
                        }
                    );
            });
    }

    getDepartments() {
        this.loading = false;
        this.provider_services.getDepartments()
            .subscribe(
                data => {
                    this.deptObj = data;
                    this.departments = this.deptObj['departments'];
                    for (let i = 0; i < this.servicesjson.length; i++) {
                        for (let j = 0; j < this.departments.length; j++) {
                            if (this.departments[j].isDefault) {
                                for (let k = 0; k < this.departments[j].serviceIds.length; k++) {
                                    if (this.departments[j].serviceIds[k] === this.servicesjson[i].id) {
                                        this.defaultdepartmentservice.push(this.servicesjson[i]);
                                    }
                                }
                            }
                        }
                    }
                },
                error => {
                    this.shared_Functionsobj.apiErrorAutoHide(this, error);
                }
            );
    }

    updateDepartment(post_data) {
        this.provider_services.updateDepartment(post_data)
            .subscribe(
                () => {
                    this.shared_Functionsobj.openSnackBar(this.shared_Functionsobj.getProjectMesssages('SERVICE_UPDATED'));
                    this.getDepartmentDetails();
                },
                error => {
                    this.shared_Functionsobj.openSnackBar(error, { 'panelClass': 'snackbarerror' });
                }
            );
    }
}
