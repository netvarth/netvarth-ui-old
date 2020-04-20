import { Component, OnInit, Input } from '@angular/core';
import { Messages } from '../../../../../../shared/constants/project-messages';
import { Router } from '@angular/router';
import * as DecoupledEditor from '@ckeditor/ckeditor5-build-decoupled-document';
import { ProviderServices } from '../../../../../../ynw_provider/services/provider-services.service';
import { SharedFunctions } from '../../../../../../shared/functions/shared-functions';


@Component({
    selector: 'app-global-settings',
    templateUrl: './global-settings.component.html'
})
export class GlobalSettingsComponent implements OnInit {
    selectedFile = null;
    footerContent = '';
    headerContent = '';
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
    onlyHeader = false;
    onlyFooter = false;
    displaybord_data;
    api_loading: boolean;
    success_error: any;
    error_list: any[];
    error_msg: string;
    item_pic = {
        files: [],
        base64: null
      };
      selitem_pic = '';
    imgProperties;
    constructor(
        private router: Router,
        private provider_services: ProviderServices,
        private shared_Functionsobj: SharedFunctions,
        private shared_functions: SharedFunctions,
        ) {}
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
        if (this.headerResult) {
            this.onlyHeader = true;
            this.provider_services.getDisplayboard(this.headerResult).subscribe(data => {
                this.displaybord_data = data;
            });
          }
    }
    // onFileSelected(file: FileList) {
    //     this.fileToUpload = file.item(0);
    //     const reader = new FileReader();
    //     reader.onload = (event: any) => {
    //         this.imageUrl = event.target.result;
    //         this.is_image = true;
    //     };
    //     reader.readAsDataURL(this.fileToUpload);
    // }

    imageSelect(input) {
        this.success_error = null;
        this.error_list = [];
        this.error_msg = '';
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
                const submit_data: FormData = new FormData();
                submit_data.append('files', this.selitem_pic, this.selitem_pic['name']);
                const propertiesDet = {
                  'caption': 'Logo'
                };
                const blobPropdata = new Blob([JSON.stringify(propertiesDet)], { type: 'application/json' });
                submit_data.append('properties', blobPropdata);
                this.imgProperties = submit_data;
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
        if (this.is_image) {
            const img_data = {
                'width': this.width,
                'height': this.height,
                'position': 'LEFT',
                'hint': 'hint',
                'properties': this.imgProperties
            };
            this.provider_services.uploadDisplayboardLogo(this.displaybord_data.id, img_data).subscribe(data => {
                this.shared_Functionsobj.openSnackBar(this.shared_Functionsobj.getProjectMesssages('DISPLAYBOARD_UPDATE'), { 'panelclass': 'snackbarerror' });
                this.router.navigate(['provider', 'settings', 'appointmentmanager', 'displayboards']);
            },
                error => {
                    this.api_loading = false;
                    this.shared_functions.openSnackBar(error, { 'panelClass': 'snackbarerror' });
                });
        }
        const post_data = {
            'id': this.displaybord_data.id,
            'name': this.displaybord_data.name,
            'layout': this.displaybord_data.layout,
            'displayName': this.displaybord_data.displayName,
            'serviceRoom': this.displaybord_data.serviceRoom,
            'metric': this.displaybord_data.metric,
            'headerSettings': this.headerContent,
            'footerSettings': this.footerContent,
        };
        this.provider_services.updateDisplayboard(post_data).subscribe(data => {
            this.shared_Functionsobj.openSnackBar(this.shared_Functionsobj.getProjectMesssages('DISPLAYBOARD_UPDATE'), { 'panelclass': 'snackbarerror' });
            this.router.navigate(['provider', 'settings', 'appointmentmanager', 'displayboards']);
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
