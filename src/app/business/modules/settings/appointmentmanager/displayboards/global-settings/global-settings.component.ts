import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import * as DecoupledEditor from '@ckeditor/ckeditor5-build-decoupled-document';
import { ProviderServices } from '../../../../../../ynw_provider/services/provider-services.service';
import { SharedFunctions } from '../../../../../../shared/functions/shared-functions';
@Component({
    selector: 'app-global-settings-appt',
    templateUrl: './global-settings.component.html'
})
export class GlobalSettingsComponent implements OnInit {
    selectedFile = null;
    footerSettings = {
        'title1': null,
    };
    headerSettings = {
        'title1': '',
        'title2': null,
        'title3': null
    };
    richdata;
    fileToUpload;
    imageUrl;
    is_image = false;
    is_preview = false;
    is_hidden = false;
    width: string;
    height: string;
    show_visible = false;
    public model = {
        editorData: ''
    };
    breadcrumbs_init = [
        {
            title: 'Settings',
            url: '/provider/settings'
        },
        {
            title: 'Appointment Manager',
            url: '/provider/settings/appointmentmanager'
        },
        {
            title: 'QBoard',
            url: '/provider/settings/appointmentmanager/displayboards'
        },
        {
            title: 'Global Settings'
        }
    ];
    largeImage: string;
    position: string;
    position_values = [
        { value: 'NONE', displayName: 'None' },
        { value: 'LEFT', displayName: 'Left' },
        { value: 'RIGHT', displayName: 'Right' }
    ];
    onlyHeader = false;
    onlyFooter = false;
    displayboard_data;
    api_loading: boolean;
    success_error: any;
    error_list: any[];
    error_msg: string;
    item_pic = {
        files: [],
        base64: null
    };
    selitem_pic = '';
    qboardLogo = '';
    imgProperties;
    imageChanged = false;
    constructor(
        private router: Router,
        private provider_services: ProviderServices,
        private shared_Functionsobj: SharedFunctions,
        private shared_functions: SharedFunctions,
    ) { }
    @Input() headerResult;
    breadcrumbs = this.breadcrumbs_init;
    url = '';
    public Editor = DecoupledEditor;
    public onReady(editor) {
        editor.ui.getEditableElement().parentElement.insertBefore(
            editor.ui.view.toolbar.element,
            editor.ui.getEditableElement()
        );
        const data = editor.getData();
    }
    ngOnInit() {
        this.api_loading = true;
        this.qboardLogo = '';
        if (this.headerResult) {
            this.onlyHeader = true;
            this.provider_services.getDisplayboardAppointment(this.headerResult).subscribe(data => {
                this.displayboard_data = data;
                console.log(this.displayboard_data);
                if (this.displayboard_data['headerSettings']) {
                    this.headerSettings['title1'] = this.displayboard_data['headerSettings']['title1'];
                }
                if (this.displayboard_data['headerSettings']) {
                    this.footerSettings['title1'] = this.displayboard_data['footerSettings']['title1'];
                }
                if (this.displayboard_data.logoSettings) {
                    if (this.displayboard_data.logoSettings.logo) {
                        this.is_image = true;
                        const logoObj = JSON.parse(this.displayboard_data.logoSettings.logo);
                        this.qboardLogo = logoObj['url'];
                    }
                    this.position = this.displayboard_data.logoSettings['position'];
                    this.width = this.displayboard_data.logoSettings['width'];
                    this.height = this.displayboard_data.logoSettings['height'];
                }
                this.api_loading = false;
            });
        }
    }
    imageSelect(input) {
        this.success_error = null;
        this.qboardLogo = '';
        this.error_list = [];
        this.error_msg = '';
        this.imageChanged = false;
        if (input.files && input.files[0]) {
            for (const file of input.files) {
                this.success_error = this.shared_Functionsobj.imageValidation(file);
                if (this.success_error === true) {
                    const reader = new FileReader();
                    this.item_pic.files = input.files[0];
                    this.selitem_pic = input.files[0];
                    this.is_image = true;
                    const fileobj = input.files[0];
                    reader.onload = (e) => {
                        this.item_pic.base64 = e.target['result'];
                        this.is_image = true;
                    };
                    reader.readAsDataURL(fileobj);
                    this.imageChanged = true;
                } else {
                    this.error_list.push(this.success_error);
                    if (this.error_list[0].type) {
                        this.error_msg = 'Selected image type not supported';
                    } else if (this.error_list[0].size) {
                        this.error_msg = 'Please upload images with size less than 15mb';
                    }
                    this.shared_Functionsobj.openSnackBar(this.error_msg, { 'panelClass': 'snackbarerror' });
                }
            }
        }
    }
    selectChangeHandler(event) {
        if (event.target.value === 'left') {
            this.position = 'left';
        } else {
            this.position = 'right';
        }
    }
    showPreview() {
        this.is_preview = true;
        this.is_hidden = true;
    }
    onUpload() {
        this.api_loading = true;
        const post_data = {
            'id': this.displayboard_data.id,
            'name': this.displayboard_data.name,
            'displayName': this.displayboard_data.displayName,
            'serviceRoom': this.displayboard_data.serviceRoom,
            'headerSettings': this.headerSettings,
            'footerSettings': this.footerSettings
        };
        if (this.displayboard_data.isContainer) {
            post_data['isContainer'] = this.displayboard_data.isContainer;
        } else {
            post_data['metric'] = this.displayboard_data.metric;
            post_data['layout'] = this.displayboard_data.layout;
        }
        console.log(JSON.stringify(post_data));
        const propertiesDet = {
            'caption': 'Logo',
            'width': this.width,
            'height': this.height,
            'position': this.position,
        };
        this.provider_services.updateDisplayboardAppointment(post_data).subscribe(data => {
            if (this.is_image) {
                const submit_data: FormData = new FormData();
                if (this.selitem_pic) {
                    submit_data.append('files', this.selitem_pic, this.selitem_pic['name']);
                    const blobPropdata = new Blob([JSON.stringify(propertiesDet)], { type: 'application/json' });
                    submit_data.append('properties', blobPropdata);
                    this.imgProperties = submit_data;
                    this.provider_services.uploadDisplayboardLogoAppointment(this.displayboard_data.id, this.imgProperties).subscribe(() => {
                        this.shared_Functionsobj.openSnackBar(this.shared_Functionsobj.getProjectMesssages('DISPLAYBOARD_UPDATE'), { 'panelclass': 'snackbarerror' });
                        this.api_loading = false;
                        this.router.navigate(['provider', 'settings', 'appointmentmanager', 'displayboards']);
                    },
                        error => {
                            this.api_loading = false;
                            this.shared_functions.openSnackBar(error, { 'panelClass': 'snackbarerror' });
                        });
                } else if (this.qboardLogo !== '') {
                    this.provider_services.uploadDisplayboardApptLogoProps(this.displayboard_data.id, propertiesDet).subscribe(() => {
                        this.shared_Functionsobj.openSnackBar(this.shared_Functionsobj.getProjectMesssages('DISPLAYBOARD_UPDATE'), { 'panelclass': 'snackbarerror' });
                        this.api_loading = false;
                        this.router.navigate(['provider', 'settings', 'appointmentmanager', 'displayboards']);
                    },
                        error => {
                            this.api_loading = false;
                            this.shared_functions.openSnackBar(error, { 'panelClass': 'snackbarerror' });
                        });
                }
                console.log(propertiesDet);

            } else {
                this.api_loading = false;
                this.shared_Functionsobj.openSnackBar(this.shared_Functionsobj.getProjectMesssages('DISPLAYBOARD_UPDATE'), { 'panelclass': 'snackbarerror' });
                this.router.navigate(['provider', 'settings', 'appointmentmanager', 'displayboards']);
            }
        },
            error => {
                this.api_loading = false;
                this.shared_functions.openSnackBar(error, { 'panelClass': 'snackbarerror' });
            });
    }
    previewCancel() {
        this.is_preview = false;
        this.is_hidden = false;
    }
    onCancel() {
        this.router.navigate(['provider', 'settings', 'appointmentmanager', 'displayboards']);
    }
}
