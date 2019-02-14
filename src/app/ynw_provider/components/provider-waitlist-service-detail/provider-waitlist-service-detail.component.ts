import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { SharedFunctions } from '../../../shared/functions/shared-functions';
import { ProviderServices } from '../../services/provider-services.service';
import { ProviderDataStorageService } from '../../services/provider-datastorage.service';
import { Messages } from '../../../shared/constants/project-messages';
import { AddProviderWaitlistServiceComponent } from '../add-provider-waitlist-service/add-provider-waitlist-service.component';
import { AddProviderWaitlistServiceGalleryComponent } from '../add-provider-waitlist-service-gallery/add-provider-waitlist-service-gallery';
import {
    AccessibilityConfig, Action, AdvancedLayout, ButtonEvent, ButtonsConfig, ButtonsStrategy, ButtonType, Description, DescriptionStrategy,
    DotsConfig, GridLayout, Image, ImageModalEvent, LineLayout, PlainGalleryConfig, PlainGalleryStrategy, PreviewConfig
} from 'angular-modal-gallery';
import { ProviderSharedFuctions } from '../../shared/functions/provider-shared-functions';
import { projectConstants } from '../../../shared/constants/project-constants';

@Component({
    selector: 'app-provider-waitlist-service-detail',
    templateUrl: './provider-waitlist-service-detail.component.html',
    styleUrls: ['./provider-waitlist-service-detail.scss']
})

export class ProviderWaitlistServiceDetailComponent implements OnInit, OnDestroy {
    price_cap = Messages.PRICES_CAP;
    pre_pay_amt = Messages.PREPAYMENT_CAP;
    tax_applicable_cap = Messages.TAX_APPLICABLE_CAP;
    end_service_notify_cap = Messages.SERVICE_NOTIFY_CAP;
    enable_cap = Messages.ENABLE_CAP;
    disbale_cap = Messages.DISABLE_CAP;
    serv_gallery = Messages.SERVICE_GALLERY_CAP;
    havent_added_cap = Messages.BPROFILE_HAVE_NOT_ADD_CAP;
    add_now_cap = Messages.BPROFILE_ADD_IT_NOW_CAP;
    delete_btn = Messages.DELETE_BTN;
    est_duration_cap = Messages.SERVICE_DURATION_CAP;
    serv_status = Messages.SERVICE_STATUS_CAP;
    photo_cap = Messages.SERVICE_PHOTO_CAP;
    service_id = null;
    service_data;
    queues: any = [];
    mapurl;
    badgeIcons = {};
    loc_badges: any = [];
    badge_map_arr: any = [];
    breadcrumbs_init = [
        {
            title: 'Settings',
            url: '/provider/settings'
        },
        {
            title: 'Waitlist Manager',
            url: '/provider/settings/waitlist-manager'
        },
        {
            title: 'Services',
            url: '/provider/settings/waitlist-manager/services'
        }
    ];
    breadcrumbs = this.breadcrumbs_init;
    image_list: any = [];
    image_list_popup: Image[];
    image_showlist: any = [];
    image_remaining_cnt = 0;
    disable_price = true;
    delgaldialogRef;
    servicedialogRef;
    editgaldialogRef;
    end_of_service_notify = projectConstants.PROFILE_ERROR_STACK;

    customPlainGalleryRowConfig: PlainGalleryConfig = {
        strategy: PlainGalleryStrategy.CUSTOM,
        layout: new AdvancedLayout(-1, true)
    };
    customButtonsFontAwesomeConfig: ButtonsConfig = {
        visible: true,
        strategy: ButtonsStrategy.CUSTOM,
        buttons: [
            {
                className: 'fa fa-trash-o',
                type: ButtonType.DELETE,
                ariaLabel: 'custom plus aria label',
                title: 'Delete',
                fontSize: '20px'
            },
            {
                className: 'inside close-image',
                type: ButtonType.CLOSE,
                ariaLabel: 'custom close aria label',
                title: 'Close',
                fontSize: '20px'
            }
        ]
    };
    isCheckin;

    constructor(
        private provider_services: ProviderServices,
        private provider_datastorage: ProviderDataStorageService,
        private shared_Functionsobj: SharedFunctions,
        private dialog: MatDialog,
        private router: Router,
        private activated_route: ActivatedRoute,
        private sanitizer: DomSanitizer,
        public provider_shared_functions: ProviderSharedFuctions) {
        this.activated_route.params.subscribe(params => {
            this.service_id = params.id;
        });
    }

    ngOnInit() {
        if (this.service_id) {
            const user = this.shared_Functionsobj.getitemfromLocalStorage('ynw-user');
            if (user['sector'] === 'foodJoints') { // this is to decide whether the price field is to be displayed or not
                this.disable_price = true;
            } else {
                this.disable_price = false;
            }
            this.getServiceDetail();

        } else {
            this.goBack();
        }
        this.isCheckin = this.shared_Functionsobj.getitemfromLocalStorage('isCheckin');
    }

    ngOnDestroy() {
        if (this.delgaldialogRef) {
            this.delgaldialogRef.close();
        }
        if (this.servicedialogRef) {
            this.servicedialogRef.close();
        }
        if (this.editgaldialogRef) {
            this.editgaldialogRef.close();
        }
    }

    getServiceDetail() {
        this.provider_services.getServiceDetail(this.service_id)
            .subscribe(
                data => {
                    this.service_data = data;
                    this.setGalleryImages(this.service_data.servicegallery || []);
                    // remove multiple end breadcrumb on edit function
                    const breadcrumbs = [];
                    this.breadcrumbs_init.map((e) => {
                        breadcrumbs.push(e);
                    });
                    breadcrumbs.push({
                        title: this.service_data.name
                    });
                    this.breadcrumbs = breadcrumbs;

                },
                error => {
                    this.goBack();
                }
            );
    }

    getGalleryImages() {
        this.provider_services.getServiceGallery(this.service_id)
            .subscribe(
                data => {
                    this.setGalleryImages(data || []);
                });
    }

    setGalleryImages(data) {

        this.image_list = data;
        // console.log(this.image_list);
        this.image_showlist = [];
        this.image_list_popup = [];
        this.image_remaining_cnt = 0;
        if (this.image_list.length > 0) {
            for (let i = 0; i < this.image_list.length; i++) {
                const imgobj = new Image(
                    i,
                    { // modal
                        img: this.image_list[i].url,
                        description: this.image_list[i].caption || ''
                    });
                this.image_list_popup.push(imgobj);
            }
        }
    }

    confirmDelete(file, indx) {
        // console.log('delete', file);
        const skey = this.image_list[indx].keyName;
        file.keyName = skey;
        // console.log('from confirm', file, indx);
        this.shared_Functionsobj.confirmGalleryImageDelete(this, file);
    }

    deleteImage(file, bypassgetgallery?) {
        this.provider_services.deleteServiceGalleryImage(this.service_id, file.keyName)
            .subscribe(
                data => {
                    // this.sharedfunctionobj.apiSuccessAutoHide(this, Messages.BPROFILE_IMAGE_DELETE);
                    if (!bypassgetgallery) {
                        this.getGalleryImages();
                    }
                },
                error => {

                }
            );
    }

    onButtonBeforeHook(event: ButtonEvent) {
        // console.log('onButtonBeforeHook ', event);
        if (!event || !event.button) {
            return;
        }
        // Invoked after a click on a button, but before that the related
        // action is applied.
        // For instance: this method will be invoked after a click
        // of 'close' button, but before that the modal gallery
        // will be really closed.
        // if (event.button.type === ButtonType.DELETE) {
        if (event.button.type === ButtonType.DELETE) {
            // remove the current image and reassign all other to the array of images
            // console.log('delete in app with images count ' + this.images.length);
            // console.log('event', event.image, event.image.id);
            const knamearr = event.image.modal.img.split('/');
            const kname = knamearr[(knamearr.length - 1)];
            const file = {
                id: event.image.id,
                keyName: kname,
                modal: {
                    img: event.image.modal.img
                },
                plain: undefined
            };
            // console.log('delete lightbox', file);
            // this.confirmDelete(file, event.image.id);
            this.deleteImage(file, true);
            this.image_list_popup = this.image_list_popup.filter((val: Image) => event.image && val.id !== event.image.id);
        }
    }

    onButtonAfterHook(event: ButtonEvent) {
        // console.log('onCustomButtonAfterHook ', event);
        if (!event || !event.button) {
            return;
        }
        // Invoked after both a click on a button and its related action.
    }

    onVisibleIndex(event: ImageModalEvent) {
        // console.log('onVisibleIndex action: ' + Action[event.action]);
        // console.log('onVisibleIndex result:' + event.result);
    }

    openImageModalRow(image: Image) {
        // console.log('Opening modal gallery from custom plain gallery row, with image: ', image);
        const index: number = this.getCurrentIndexCustomLayout(image, this.image_list_popup);
        this.customPlainGalleryRowConfig = Object.assign({}, this.customPlainGalleryRowConfig, { layout: new AdvancedLayout(index, true) });
    }

    getCurrentIndexCustomLayout(image: Image, images: Image[]): number {
        return image ? images.indexOf(image) : -1;
    }

    // editService() {
    //     if (!this.service_data.id) { return false; }
    //     this.servicedialogRef = this.dialog.open(AddProviderWaitlistServiceComponent, {
    //         width: '50%',
    //         panelClass: ['commonpopupmainclass'],
    //         disableClose: true,
    //         autoFocus: true,
    //         data: {
    //             type: 'edit',
    //             service: this.service_data
    //         }
    //     });
    //     this.servicedialogRef.afterClosed().subscribe(result => {
    //         if (result === 'reloadlist') {
    //             this.getServiceDetail();
    //         }
    //     });
    // }

    addEditProviderService(type, service = null) {
        this.provider_shared_functions.addEditServicePopup(this, type, 'service_detail', this.service_data, this.provider_shared_functions.getActiveQueues());
    }

    editImageGallery() {
        if (!this.service_data.id) { return false; }
        this.editgaldialogRef = this.dialog.open(AddProviderWaitlistServiceGalleryComponent, {
            width: '50%',
            panelClass: ['commonpopupmainclass'],
            disableClose: true,
            data: {
                type: 'edit',
                service_id: this.service_data.id
            }
        });
        this.editgaldialogRef.afterClosed().subscribe(result => {
            if (result === 'reloadlist') {
                this.getGalleryImages();
            }
        });
    }

    goBack() {
        this.router.navigate(['provider', 'settings', 'waitlist-manager',
            'services']);
    }

    changeServiceStatus(service) {
        this.provider_shared_functions.changeServiceStatus(this, service);
    }

    disableService(service, msg) {
        this.provider_services.disableService(service.id)
            .subscribe(
                data => {
                    this.getServiceDetail();
                    const snackBarRef = this.shared_Functionsobj.openSnackBar(msg);
                },
                error => {
                    const snackBarRef = this.shared_Functionsobj.openSnackBar(error, { 'panelClass': 'snackbarerror' });
                    this.getServiceDetail();
                });
    }

    enableService(service, msg) {
        this.provider_services.enableService(service.id)
            .subscribe(
                data => {
                    this.getServiceDetail();
                    const snackBarRef = this.shared_Functionsobj.openSnackBar(msg);
                },
                error => {
                    const snackBarRef = this.shared_Functionsobj.openSnackBar(error, { 'panelClass': 'snackbarerror' });
                    this.getServiceDetail();
                });
    }
}