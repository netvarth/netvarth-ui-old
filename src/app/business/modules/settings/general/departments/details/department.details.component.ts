import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ProviderServices } from '../../../../../../ynw_provider/services/provider-services.service';
import { SharedFunctions } from '../../../../../../shared/functions/shared-functions';
import { Messages } from '../../../../../../shared/constants/project-messages';
import { MatDialog } from '@angular/material';
import { FormControl } from '@angular/forms';
import { ConfirmBoxComponent } from '../../../../../../shared/components/confirm-box/confirm-box.component';
@Component({
    'selector': 'app-department-details',
    'templateUrl': './department-details.component.html'
})
export class DepartmentDetailComponent implements OnInit {
    dept_data;
    dept_id;
    breadcrumbs_init = [
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
            title: 'Department List',
            url: '/provider/settings/general/departments/list'
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
    dept_default = false;
    serviceArray;
    userlist: any = [];
    users: any = [];
    provider_label = '';
    constructor(private changeDetectorRef: ChangeDetectorRef,
        private router: Router,
        private dialog: MatDialog,
        private provider_services: ProviderServices,
        private shared_Functionsobj: SharedFunctions,
        private activated_route: ActivatedRoute) {
        this.activated_route.params.subscribe(params => {
            this.dept_id = params.id;
        });
    }
    ngOnInit() {
        this.loading = true;
        this.provider_label = this.shared_Functionsobj.getTerminologyTerm('provider');
        // this.getServices();
        this.getDepartments();
        if (this.dept_id === 'add') {
            this.dept_id = null;
            this.showServc = false;
            const breadcrumbs = [];
            this.breadcrumbs_init.map((e) => {
                breadcrumbs.push(e);
            });
            breadcrumbs.push({
                title: 'Add'
            });
            this.breadcrumbs = breadcrumbs;
        }
        if (this.dept_id) {
            this.getDepartmentDetails();
        } else {
            this.selected_action = 'add';
        }
        this.isCheckin = this.shared_Functionsobj.getitemFromGroupStorage('isCheckin');
        this.getUsers();
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
        this.deptServices.setValue('');
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
                        this.getDepartments();
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
                this.getDepartments();
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
                this.router.navigate(['provider/settings/general/departments/list']);
            }
        }
    }
    getUsers() {
                    this.provider_services.getUsers().subscribe(
                        (data: any) => {
                            this.users = data;
                        },

                        (error: any) => {
                            this.shared_Functionsobj.openSnackBar(error, { 'panelClass': 'snackbarerror' });
                        });
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
            const filter = { 'serviceType-neq': 'donationService', 'scope-eq': 'account' };
            this.provider_services.getServicesList(filter)
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
        ///   this.srvcArry = this.defaultdepartmentservice;
        this.serviceArray = this.defaultdepartmentservice;
        for (const serv of this.serviceArray) {
            if (serv.serviceType !== 'donationService' && serv.status !== 'INACTIVE') {
                this.srvcArry.push(serv);
            }
        }
        // this.showAllServices = true;
    }
    addnewClick() {
        this.showAllServices = true;
    }
    getDepartmentDetails() {
        console.log(this.dept_id);
        this.loading = true;
        this.getServices().then(
            res => {
                this.provider_services.getDepartmentById(this.dept_id)
                    .subscribe(
                        data => {
                            this.userlist = [];
                            this.add_it_now_show = true;
                            this.dept_data = data;
                            if (this.dept_data.isDefault === true) {
                                this.dept_default = true;
                            }
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
                            for (const usr of this.users) {
                                if (usr.deptId === this.dept_data.departmentId) {
                                    this.userlist.push(usr);
                                    this.dept_data['users'] = this.userlist;
                                }

                            }
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
        this.getServices().then(
            () => {
                this.provider_services.getDepartments()
                    .subscribe(
                        data => {
                            this.deptObj = data;
                            console.log(this.deptObj);
                            this.departments = this.deptObj['departments'];
                            this.defaultdepartmentservice = [];
                            for (let i = 0; i < this.servicesjson.length; i++) {
                                for (let j = 0; j < this.departments.length; j++) {
                                    if (this.departments[j].isDefault) {
                                        if (this.departments[j].serviceIds.length > 0) {
                                            for (let k = 0; k < this.departments[j].serviceIds.length; k++) {
                                                if (this.departments[j].serviceIds[k] === this.servicesjson[i].id) {
                                                    if (this.defaultdepartmentservice.indexOf(this.servicesjson[i]) === -1) {
                                                        this.defaultdepartmentservice.push(this.servicesjson[i]);
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                            this.editLocationServices();
                        },
                        error => {
                            this.shared_Functionsobj.apiErrorAutoHide(this, error);
                        }
                    );
            });
    }

    updateDepartment(post_data) {
        this.provider_services.updateDepartment(post_data)
            .subscribe(
                () => {
                    this.shared_Functionsobj.openSnackBar('Departments updated successfully');
                    this.getDepartmentDetails();
                },
                error => {
                    this.shared_Functionsobj.openSnackBar(error, { 'panelClass': 'snackbarerror' });
                }
            );
    }
}
