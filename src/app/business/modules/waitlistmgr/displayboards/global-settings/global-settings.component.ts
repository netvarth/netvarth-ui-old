import { Component, OnInit, Input } from '@angular/core';
import { Messages } from '../../../../../shared/constants/project-messages';
import { Router } from '@angular/router';
import * as DecoupledEditor from '@ckeditor/ckeditor5-build-decoupled-document';
import { ProviderServices } from '../../../../../ynw_provider/services/provider-services.service';
import { SharedFunctions } from '../../../../../shared/functions/shared-functions';


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
            title: Messages.WAITLIST_MANAGE_CAP,
            url: '/provider/settings/q-manager'
        },
        {
            title: 'QBoard',
            url: '/provider/settings/q-manager/displayboards'
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
    onFileSelected(file: FileList) {
        this.fileToUpload = file.item(0);
        const reader = new FileReader();
        reader.onload = (event: any) => {
            this.imageUrl = event.target.result;
            this.is_image = true;
        };
        reader.readAsDataURL(this.fileToUpload);
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
        // this.largeImage = document.getElementById('previewPage').innerHTML;
        // const WindowPrt = window.open('', '', 'left=50,top=0,width=500,height=700,toolbar=0,scrollbars=0,status=0');
        // WindowPrt.document.write('<div style="display:flex">');
        // WindowPrt.document.write('<div>' + this.headerContent + '</div>');
        // WindowPrt.document.write('<p>' + this.largeImage + '<p>');
        // WindowPrt.document.write('</div>');
        // WindowPrt.document.write('<div>' + this.footerContent + '</div>');
        // WindowPrt.document.close();
    }
    onUpload() {
        const img_data = {
            'width': this.width,
            'height': this.height,
            'position': 'LEFT',
            'hint': 'hint',
            'properties': this.imageUrl
        };
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
            this.router.navigate(['provider', 'settings', 'q-manager', 'displayboards']);
        },
            error => {
                this.api_loading = false;
                this.shared_functions.openSnackBar(error, { 'panelClass': 'snackbarerror' });
            });
            // this.provider_services.uploadDisplayboardLogo(this.displaybord_data.id, img_data).subscribe(data => {
            //     this.shared_Functionsobj.openSnackBar(this.shared_Functionsobj.getProjectMesssages('DISPLAYBOARD_UPDATE'), { 'panelclass': 'snackbarerror' });
            //     this.router.navigate(['provider', 'settings', 'q-manager', 'displayboards']);
            // },
            //     error => {
            //         this.api_loading = false;
            //         this.shared_functions.openSnackBar(error, { 'panelClass': 'snackbarerror' });
            //     });
    }
    previewCancel() {
        this.is_preview = false;
        this.is_hidden = false;
    }
    onCancel() {
        this.router.navigate(['provider', 'settings', 'q-manager', 'displayboards']);
    }
}
