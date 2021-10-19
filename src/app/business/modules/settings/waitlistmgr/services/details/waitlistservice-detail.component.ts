import { Component, OnInit, OnDestroy } from '@angular/core';
import { Messages } from '../../../../../../shared/constants/project-messages';
import { ProviderServices } from '../../../../../services/provider-services.service';
import { SharedFunctions } from '../../../../../../shared/functions/shared-functions';
import { Router, ActivatedRoute } from '@angular/router';
import { ProviderSharedFuctions } from '../../../../../functions/provider-shared-functions';
import { Subscription } from 'rxjs';
import { ServicesService } from '../../../../../../shared/modules/service/services.service';
import { GalleryService } from '../../../../../../shared/modules/gallery/galery-service';
import { Location } from '@angular/common';
import { SnackbarService } from '../../../../../../shared/services/snackbar.service';
import { WordProcessor } from '../../../../../../shared/services/word-processor.service';
import { GroupStorageService } from '../../../../../../shared/services/group-storage.service';

@Component({
    selector: 'app-waitlistservice-detail',
    templateUrl: './waitlistservice-detail.component.html'
})
export class WaitlistServiceDetailComponent implements OnInit, OnDestroy {
    actionparam = 'show'; // To know whether clicked edit/view from the services list page
    serviceParams = { 'action': 'show' };
    service_id = null;
    api_loading = false;
    customer_label: any;
    status;
    image_list: any = [];
    serviceExists = true;
    showGallery = false;
    subscription: Subscription; // for gallery
    serviceSubscription: Subscription; // from service module
    infoSubscription: Subscription;
    servstatus;
    domain;
    can_change_hours = Messages.BPROFILE_CHANGE_SERVICE_WORKING_HOURS_CAP;
    click_here_cap = Messages.CLICK_HERE_CAP;
    view_time_wind_cap = Messages.BPROFILE_VIEW_SERVICE_WINDOW_CAP;
    servicecaption = 'Add Service';
    hideBack = false;
    constructor(private provider_services: ProviderServices,
        private sharedfunctionObj: SharedFunctions,
        private servicesService: ServicesService,
        private galleryService: GalleryService,
        private activated_route: ActivatedRoute,
        private router: Router, public location: Location,
        private snackbarService: SnackbarService,
        private wordProcessor: WordProcessor,
        private groupService: GroupStorageService,
        private provider_shared_functions: ProviderSharedFuctions) {
        const user = this.groupService.getitemFromGroupStorage('ynw-user');
        this.domain = user.sector;
        this.activated_route.params.subscribe(
            (params) => {
                this.service_id = params.id;
                this.customer_label = this.wordProcessor.getTerminologyTerm('customer');
            }
        );
        this.activated_route.queryParams.subscribe(
            params => {
                this.actionparam = params.action;
            });
    }
    ngOnDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
        if (this.infoSubscription) {
            this.infoSubscription.unsubscribe();
        }
        if (this.serviceSubscription) {
            this.serviceSubscription.unsubscribe();
        }
    }
    ngOnInit() {
        setTimeout(() => this.showGallery = true, 1200);
        this.initServiceParams();
        this.infoSubscription = this.sharedfunctionObj.getMessage().subscribe(message => {
            switch (message.ttype) {
                case 'hide-back':
                    this.hideBack = true;
                    this.servicecaption = 'Pre and Post instructions';
                    break;
                case 'show-back':
                    this.hideBack = false;
                    if (this.service_id) {
                        this.servicecaption = 'Edit Service';
                    } else {
                        this.servicecaption = 'Add Service';
                    }
                    break;
            }
        });
        this.subscription = this.galleryService.getMessage().subscribe(input => {
            if (input.ttype === 'image-upload') {
                this.provider_services.uploadServiceGallery(input.sourceId, input.value)
                    .subscribe(
                        () => {
                            this.getGalleryImages();
                            this.snackbarService.openSnackBar(Messages.ITEMIMAGE_UPLOADED, { 'panelClass': 'snackbarnormal' });
                            this.galleryService.sendMessage({ ttype: 'upload', status: 'success' });
                        },
                        error => {
                            this.snackbarService.openSnackBar(error.error, { 'panelClass': 'snackbarerror' });
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
                            this.servicecaption = 'Edit Service';
                            post_itemdata2.id = this.service_id;
                            if (post_itemdata2.livetrack !== this.serviceParams['service'].livetrack) {
                                this.changeLiveTrackStatus(post_itemdata2);
                            } else {
                                this.updateService(post_itemdata2);
                            }
                        } else if (serviceActionModel.action === 'changestatus') {
                            this.changeServiceStatus(post_itemdata2);
                        }
                    } else {
                        if (serviceActionModel.action === 'edit') {
                            this.servicecaption = ' Edit Service';
                            this.serviceParams['action'] = 'edit';
                            this.servicesService.initServiceParams(this.serviceParams);
                        } else if (serviceActionModel.action === 'close' && serviceActionModel.source !== 'add') {
                            this.serviceParams['action'] = 'show';
                            this.servicecaption = 'Service Details';
                            this.servicesService.initServiceParams(this.serviceParams);
                        } else {
                            this.router.navigate(['provider/settings/q-manager/services']);
                        }
                    }
                }
            }
        );
        return false;
    }

    changeLiveTrackStatus(service) {
        let status;
        if (service.livetrack === false) {
            status = 'Disable';
        } else {
            status = 'Enable';
        }
        this.provider_services.setServiceLivetrack(status, service.id)
            .subscribe(
                () => {
                    this.updateService(service);
                },
                error => {
                    this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
                }
            );
    }
    getDomainSubdomainSettings() {
        const user_data = this.groupService.getitemFromGroupStorage('ynw-user');
        const domain = user_data.sector || null;
        const sub_domain = user_data.subSector || null;
        return new Promise((resolve, reject) => {
            this.provider_services.domainSubdomainSettings(domain, sub_domain)
                .subscribe(
                    (data: any) => {
                        this.serviceParams['subdomainsettings'] = data;
                        resolve(data);
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
                        resolve(data);
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
                    resolve(data);
                },
                    error => {
                        reject(error);
                    });
        });
    }
    getServiceDetail() {
        this.api_loading = true;
        this.provider_services.getServiceDetail(this.service_id)
            .subscribe(
                data => {
                    this.serviceParams['service'] = data;
                    this.serviceParams['action'] = 'show';
                    this.servicecaption = 'Service Details';
                    this.status = this.serviceParams['service'].status;
                    this.setGalleryImages(this.serviceParams['service'].servicegallery || []);
                    this.api_loading = false;
                    if (this.actionparam === 'edit') {
                        this.servicecaption = 'Edit Service';
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
                                if (this.service_id === 'add') {
                                    this.service_id = null;
                                    this.api_loading = false;
                                }
                                if (this.service_id) {
                                    this.getServiceDetail();
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
        this.provider_services.createService(post_data)
            .subscribe(
                (id) => {
                    this.service_id = id;
                    this.sharedfunctionObj.sendMessage({ 'ttype': 'serviceChange' });
                    this.getServiceDetail();
                },
                error => {
                    this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
                }
            );
    }
    updateService(post_data) {
        this.provider_services.updateService(post_data)
            .subscribe(
                () => {
                    this.snackbarService.openSnackBar(this.wordProcessor.getProjectMesssages('SERVICE_UPDATED'));
                    this.location.back();
                    this.getServiceDetail();
                },
                error => {
                    this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
                }
            );
    }
    enableService(service) {
        this.provider_services.enableService(service.id)
            .subscribe(
                () => {
                    this.getServiceDetail();
                },
                (error) => {
                    this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
                    this.servstatus = false;
                    this.getServiceDetail();
                });
    }
    disableService(service) {
        this.provider_services.disableService(service.id)
            .subscribe(
                () => {
                    this.getServiceDetail();
                },
                (error) => {
                    this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
                    this.servstatus = true;
                    this.getServiceDetail();
                });
    }
    changeServiceStatus(service) {
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
        this.router.navigate(['provider', 'settings', 'q-manager',
            'services']);
        this.api_loading = false;
    }
    redirecToServices() {
        if (this.hideBack) {
            this.sharedfunctionObj.sendMessage({ ttype: 'hide-prepost' });
            this.hideBack = false;
            if (this.service_id) {
                this.servicecaption = 'Edit Service';
            } else {
                this.servicecaption = 'Add Service';
            }
        } else {
            this.router.navigate(['provider', 'settings', 'q-manager', 'services']);
        }
    }
}
