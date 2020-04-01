import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { Messages } from '../../../../../shared/constants/project-messages';
import { Router } from '@angular/router';
import * as DecoupledEditor from '@ckeditor/ckeditor5-build-decoupled-document';


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
    width;
    height;
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
    imageWidth: any;
    constructor(
        private router: Router) {
    }
    breadcrumbs = this.breadcrumbs_init;
    url = '';
    public Editor = DecoupledEditor;
    public onReady(editor) {
        editor.ui.getEditableElement().parentElement.insertBefore(
            editor.ui.view.toolbar.element,
            editor.ui.getEditableElement()
        );
        const data = editor.getData();
        console.log(data);
    }
    ngOnInit() {
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
    showPreview() {
        this.largeImage = document.getElementById('image').innerHTML;
        this.imageWidth = this.width;
        console.log(this.imageWidth)
        const WindowPrt = window.open('', '', 'left=0,top=0,width=500,height=700,toolbar=0,scrollbars=0,status=0');
        WindowPrt.document.write('<html><head><title></title>');
        WindowPrt.document.write('</head><body>');
        WindowPrt.document.write('<div style="text-align-last: center;padding-top: 50px">');
        WindowPrt.document.write('<p>' + this.headerContent + '<p>');
        WindowPrt.document.write('</div>');
        WindowPrt.document.write('<div style="text-align-last: center;">');
        WindowPrt.document.write('<p>' + this.largeImage + '<p>');
        WindowPrt.document.write('</div>');
        WindowPrt.document.write('<div style="text-align-last: center;padding-top: 50px">');
        WindowPrt.document.write('<p>' + this.footerContent + '<p>');
        WindowPrt.document.write('</div>');
        WindowPrt.document.write('</body></html>');
        WindowPrt.document.close();

    }
    closePrevw() {
        this.is_preview = false;
    }
    onUpload() {

    }
    onCancel() {
        this.router.navigate(['provider', 'settings', 'q-manager', 'displayboards']);
    }
}
