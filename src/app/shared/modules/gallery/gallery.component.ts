import { OnInit, Component, EventEmitter, Output, Input, OnChanges } from '@angular/core';
import { ButtonEvent, Image, ButtonType, ButtonsStrategy, ButtonsConfig, AdvancedLayout, PlainGalleryStrategy, PlainGalleryConfig } from 'angular-modal-gallery';
import { MatDialog } from '@angular/material';
import { GalleryImportComponent } from './import/gallery-import.component';
import { Subscription } from 'rxjs/Subscription';
import { GalleryService } from './galery-service';
import { Messages } from '../../constants/project-messages';
import { SharedFunctions } from '../../functions/shared-functions';

@Component({
    selector: 'app-jaldee-gallery',
    templateUrl: './gallery.component.html'
})

export class GalleryComponent implements OnInit, OnChanges {
    @Output() action = new EventEmitter<any>();
    @Input() source_id;
    @Input() images;
    @Input() status;
    @Input() source;
    activeHeader;
    image_list: any = [];
    image_list_popup: Image[];
    galleryDialog;
    gallery_view_caption = Messages.GALLERY_CAP;
    havent_added_cap = Messages.BPROFILE_HAVE_NOT_ADD_CAP;
    add_now_cap = Messages.BPROFILE_ADD_IT_NOW_CAP;
    photo_cap = Messages.SERVICE_PHOTO_CAP;
    delete_btn = Messages.DELETE_BTN;
    subscription: Subscription;
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
    img_lst_lngth: any;
    constructor(private sharedfunctionObj: SharedFunctions, private dialog: MatDialog,
        private galleryService: GalleryService) {
    }
    editImageGallery() {
        // if (!this.service_data.id) { return false; }
        this.galleryDialog = this.dialog.open(GalleryImportComponent, {
            width: '50%',
            panelClass: ['popup-class', 'commonpopupmainclass'],
            disableClose: true,
            data: {
                type: 'edit',
                source_id: this.source_id || this.source
            }
        });
        this.galleryDialog.componentInstance.performUpload.subscribe(
            (imagelist_input) => {
                const input = {
                    'type': 'add',
                    'value': imagelist_input
                };
                this.action.emit(input);
            });
        this.galleryDialog.afterClosed().subscribe(result => {
            if (result === 'reloadlist') {
                // this.getGalleryImages();
            }
        });
    }
    ngOnChanges() {
        this.image_list = this.images || [];
        this.loadImages(this.image_list);
    }
    ngOnInit() {
    }
    loadImages(imagelist) {
        this.image_list_popup = [];
        if (imagelist.length > 0) {
            for (let i = 0; i < imagelist.length; i++) {
                const imgobj = new Image(
                    i,
                    { // modal
                        img: imagelist[i].url,
                        description: imagelist[i].caption || ''
                    });
                this.image_list_popup.push(imgobj);
            }
        }
        this.img_lst_lngth=this.image_list_popup.length;
    }
    confirmDelete(file, indx) {
        const skey = this.image_list[indx].keyName;
        file.keyName = skey;
        this.sharedfunctionObj.confirmGalleryImageDelete(this, file);
    }
    onButtonBeforeHook(event: ButtonEvent) {
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
            // this.confirmDelete(file, event.image.id);
            this.deleteImage(file, true);
            this.image_list_popup = this.image_list_popup.filter((val: Image) => event.image && val.id !== event.image.id);
        }
    }
    deleteImage(file, bypassgetgallery?) {
        const input = {
            'ttype': 'delete-image',
            'value': file.keyName,
            'bypassgetgallery': bypassgetgallery
        };
        this.galleryService.sendMessage(input);
    }
    onButtonAfterHook(event: ButtonEvent) {
        if (!event || !event.button) {
            return;
        }
        // Invoked after both a click on a button and its related action.
    }
    onVisibleIndex() {
    }
    openImageModalRow(image: Image) {
        // console.log('Opening modal gallery from custom plain gallery row, with image: ', image);
        const index: number = this.getCurrentIndexCustomLayout(image, this.image_list_popup);
        this.customPlainGalleryRowConfig = Object.assign({}, this.customPlainGalleryRowConfig, { layout: new AdvancedLayout(index, true) });
    }
    getCurrentIndexCustomLayout(image: Image, images: Image[]): number {
        return image ? images.indexOf(image) : -1;
    }
}
