import { Component, OnInit, OnDestroy } from '@angular/core';
import { Messages } from '../../../../../../../../shared/constants/project-messages';
import { ProviderServices } from '../../../../../../../../ynw_provider/services/provider-services.service';
import { SharedFunctions } from '../../../../../../../../shared/functions/shared-functions';
import { Router, ActivatedRoute } from '@angular/router';
import { ProviderSharedFuctions } from '../../../../../../../../ynw_provider/shared/functions/provider-shared-functions';
import { Subscription } from 'rxjs';
import { ServicesService } from '../../../../../../../../shared/modules/service/services.service';
import { GalleryService } from '../../../../../../../../shared/modules/gallery/galery-service';

@Component({
    selector: 'app-userservice-detail',
    templateUrl: './waitlistservice-detail.component.html'
})
export class WaitlistServiceDetailComponent implements OnInit, OnDestroy {
    actionparam = 'show'; // To know whether clicked edit/view from the services list page
    serviceParams = { 'action': 'show' };
    servicelevel = 'userlevel';
    service_id = null;
    api_loading = false;
    customer_label: any;
    status;
    image_list: any = [];
    serviceExists = true;
    breadcrumbs_init = [
        {
            title: 'Settings',
            url: '/provider/settings'
        },
        {
            url: '/provider/settings/miscellaneous',
            title: 'Miscellaneous'
        },
        {
            url: '/provider/settings/miscellaneous/users',
            title: 'Users'
        }
    ];
    breadcrumbs = this.breadcrumbs_init;
    subscription: Subscription; // for gallery
    serviceSubscription: Subscription; // from service module
    servstatus;
    can_change_hours = Messages.BPROFILE_CHANGE_SERVICE_WORKING_HOURS_CAP;
    click_here_cap = Messages.CLICK_HERE_CAP;
    view_time_wind_cap = Messages.BPROFILE_VIEW_SERVICE_WINDOW_CAP;
    userId: any;
    userDetails: any;
    constructor(private provider_services: ProviderServices,
        private sharedfunctionObj: SharedFunctions,
        private servicesService: ServicesService,
        private galleryService: GalleryService,
        private activated_route: ActivatedRoute,
        private router: Router,
        private provider_shared_functions: ProviderSharedFuctions) {
        this.activated_route.params.subscribe(
            (params) => {
                this.service_id = params.sid;
                this.userId = params.id;
                console.log(params.id);
                console.log(this.service_id);
                this.customer_label = this.sharedfunctionObj.getTerminologyTerm('customer');
                if (this.service_id === 'add') {
                    const breadcrumbs = [];
                    this.breadcrumbs_init.map((e) => {
                        breadcrumbs.push(e);
                    });
                    breadcrumbs.push({
                        title: this.userId,
                        url: '/provider/settings/miscellaneous/users/add?type=edit&val=' + this.userId,
                    });
                    breadcrumbs.push({
                        title: 'Settings',
                        url: '/provider/settings/miscellaneous/users/' + this.userId + '/settings'
                    });
                    breadcrumbs.push({
                        title: 'Services',
                        url: '/provider/settings/miscellaneous/users/' + this.userId + '/settings/services'
                    });
                    breadcrumbs.push({
                        title: 'Add'
                    });
                    this.breadcrumbs = breadcrumbs;
                }
            }
        );
        this.activated_route.queryParams.subscribe(
            params => {
                this.actionparam = params.action;
            });
    }
    ngOnDestroy() {
        this.subscription.unsubscribe();
        this.serviceSubscription.unsubscribe();
    }
    ngOnInit() {
        this.getUserDetails(this.userId).then(
            (userInfo) => {
                this.userDetails = userInfo;
                this.initServiceParams();
            });
        this.subscription = this.galleryService.getMessage().subscribe(input => {
            if (input.ttype === 'image-upload') {
                this.provider_services.uploadServiceGallery(input.sourceId, input.value)
                    .subscribe(
                        () => {
                            this.getGalleryImages();
                            this.sharedfunctionObj.openSnackBar(Messages.ITEMIMAGE_UPLOADED, { 'panelClass': 'snackbarnormal' });
                            this.galleryService.sendMessage({ ttype: 'upload', status: 'success' });
                        },
                        error => {
                            this.sharedfunctionObj.openSnackBar(error.error, { 'panelClass': 'snackbarerror' });
                            this.galleryService.sendMessage({ ttype: 'upload', status: 'failure' });
                        }
                    );
            } else if (input.ttype === 'delete-image') {
                this.deleteImage(input.value, input.bypassgetgallery);
            }
        });
        this.serviceSubscription = this.servicesService.serviceUpdated.subscribe(
            serviceActionModel => {
                if (serviceActionModel) {
                    if (serviceActionModel.service) {
                        const post_itemdata2 = serviceActionModel.service;
                        post_itemdata2.bType = 'Waitlist';
                        if (serviceActionModel.action === 'add') {
                            this.createService(post_itemdata2);
                        } else if (serviceActionModel.action === 'edit') {
                            post_itemdata2.id = this.service_id;
                            this.updateService(post_itemdata2);
                        } else if (serviceActionModel.action === 'changestatus') {
                            this.changeServiceStatus(post_itemdata2);
                        }
                    } else {
                        if (serviceActionModel.action === 'edit') {
                            this.serviceParams['action'] = 'edit';
                            this.servicesService.initServiceParams(this.serviceParams);
                        } else if (serviceActionModel.action === 'close' && serviceActionModel.source !== 'add') {
                            this.serviceParams['action'] = 'show';
                            this.servicesService.initServiceParams(this.serviceParams);
                        } else {
                            this.router.navigate(['/provider/settings/miscellaneous/users/' + this.userId + '/settings/services']);
                        }
                    }
                }
            }
        );
        return false;
    }
    getDomainSubdomainSettings() {
        const user_data = this.sharedfunctionObj.getitemFromGroupStorage('ynw-user');
        const domain = user_data.sector || null;
        const sub_domain = user_data.subSector || null;
        return new Promise((resolve, reject) => {
            this.provider_services.domainSubdomainSettings(domain, sub_domain)
                .subscribe(
                    (data: any) => {
                        this.serviceParams['subdomainsettings'] = data;
                        resolve();
                    },
                    error => {
                        reject(error);
                    }
                );
        });
    }
    getPaymentSettings() {
        return new Promise((resolve, reject) => {
            this.provider_services.getPaymentSettings()
                .subscribe(
                    data => {
                        this.serviceParams['paymentsettings'] = data;
                        resolve();
                    },
                    error => {
                        reject(error);
                    }
                );
        });
    }
    getTaxpercentage() {
        return new Promise((resolve, reject) => {
            this.provider_services.getTaxpercentage()
                .subscribe(data => {
                    this.serviceParams['taxsettings'] = data;
                    resolve();
                },
                    error => {
                        reject(error);
                    });
        });
    }
    getUserDetails(userId) {
        return new Promise((resolve, reject) => {
            this.provider_services.getUser(userId).subscribe(
                (userInfo: any) => {
                    resolve(userInfo);
                }, error => {
                    reject(error);
                });
        });
    }
    getUserServiceDetail() {
        this.api_loading = true;
        this.provider_services.getUserServiceDetail(this.service_id)
            .subscribe(
                data => {
                    this.serviceParams['service'] = data;
                    this.serviceParams['action'] = 'show';
                    this.status = this.serviceParams['service'].status;
                    this.setGalleryImages(this.serviceParams['service'].servicegallery || []);
                    // remove multiple end breadcrumb on edit function
                    const breadcrumbs = [];
                    this.breadcrumbs_init.map((e) => {
                        breadcrumbs.push(e);
                    });
                    breadcrumbs.push({
                        title: this.userId,
                        url: '/provider/settings/miscellaneous/users/add?type=edit&val=' + this.userId,
                    });
                    breadcrumbs.push({
                        title: 'Settings',
                        url: '/provider/settings/miscellaneous/users/' + this.userId + '/settings'
                    });
                    breadcrumbs.push({
                        title: 'Services',
                        url: '/provider/settings/miscellaneous/users/' + this.userId + '/settings/services'
                    });
                    breadcrumbs.push({
                        title: this.serviceParams['service'].name
                    });
                    this.breadcrumbs = breadcrumbs;
                    this.api_loading = false;
                    if (this.actionparam === 'edit') {
                        this.serviceParams['action'] = 'edit';
                    }
                    this.servicesService.initServiceParams(this.serviceParams);
                },
                () => {
                    this.api_loading = false;
                    this.goBack();
                }
            );
    }
    initServiceParams() {
        this.getPaymentSettings().then(
            () => {
                this.getDomainSubdomainSettings().then(
                    () => {
                        this.getTaxpercentage().then(
                            () => {
                                this.serviceParams['userId'] = this.userId;
                                this.serviceParams ['deptId'] = this.userDetails.deptId;
                                if (this.service_id === 'add') {
                                    this.service_id = null;
                                    this.api_loading = false;
                                }
                                if (this.service_id) {
                                    this.getUserServiceDetail();
                                } else {
                                    this.serviceParams['action'] = 'add';
                                    this.servicesService.initServiceParams(this.serviceParams);
                                }
                            }, () => {
                            });
                    }, () => {
                    }
                );
            }, () => {
            }
        );
    }
    createService(post_data) {
        post_data['provider'] = { 'id': this.userId };
        this.provider_services.createService(post_data)
            .subscribe(
                (id) => {
                    this.service_id = id;
                    this.getUserServiceDetail();
                },
                error => {
                    this.sharedfunctionObj.openSnackBar(error, { 'panelClass': 'snackbarerror' });
                }
            );
    }
    updateService(post_data) {
        post_data['provider'] = { 'id': this.userId };
        this.provider_services.updateService(post_data)
            .subscribe(
                () => {
                    this.sharedfunctionObj.openSnackBar(this.sharedfunctionObj.getProjectMesssages('SERVICE_UPDATED'));
                    this.getUserServiceDetail();
                },
                error => {
                    this.sharedfunctionObj.openSnackBar(error, { 'panelClass': 'snackbarerror' });
                }
            );
    }
    enableService(service) {
        this.provider_services.enableService(service.id)
            .subscribe(
                () => {
                    this.getUserServiceDetail();
                },
                (error) => {
                    this.sharedfunctionObj.openSnackBar(error, { 'panelClass': 'snackbarerror' });
                    this.servstatus = false;
                    this.getUserServiceDetail();
                });
    }
    disableService(service) {
        this.provider_services.disableService(service.id)
            .subscribe(
                () => {
                    this.getUserServiceDetail();
                },
                (error) => {
                    this.sharedfunctionObj.openSnackBar(error, { 'panelClass': 'snackbarerror' });
                    this.servstatus = true;
                    this.getUserServiceDetail();
                });
    }
    changeServiceStatus(service) {
        service['provider'] = { 'id': this.userId };
        this.provider_shared_functions.changeServiceStatus(this, service);
    }
    /*Gallery Section*/
    setGalleryImages(data) {
        this.image_list = data;
    }
    getGalleryImages() {
        this.provider_services.getServiceGallery(this.service_id)
            .subscribe(
                data => {
                    this.setGalleryImages(data || []);
                });
    }
    deleteImage(fileName, bypassgetgallery?) {
        this.provider_services.deleteServiceGalleryImage(this.service_id, fileName)
            .subscribe(
                () => {
                    if (!bypassgetgallery) {
                        this.getGalleryImages();
                    }
                },
                () => {
                }
            );
    }
    // Gallery Section ends
    goBack() {
        this.router.navigate(['provider', 'settings', 'miscellaneous', 'users', this.userId, 'settings',
            'services']);
        this.api_loading = false;
    }
}
