import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { Messages } from '../../../../../shared/constants/project-messages';
@Component({
    selector: 'app-global-settings',
    templateUrl: './global-settings.component.html'
})
export class GlobalSettingsComponent implements OnInit {
    selectedFile = null;
    footerContent;
    headerContent;
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
        }
    ];
    breadcrumbs = this.breadcrumbs_init;
    url = '';
    ngOnInit() {
    }
    onFileSelected(file: FileList) {
      this.fileToUpload = file.item(0);
      let reader = new FileReader();
      reader.onload = (event: any) => {
        this.imageUrl = event.target.result;
        this.is_image = true;
      }
      reader.readAsDataURL(this.fileToUpload);
    }
    showPreview(){
        this.is_preview = true;
    }
    closePrevw(){
        this.is_preview = false;
    }
    onUpload() {

    }
}