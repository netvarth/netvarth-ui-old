import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { SharedFunctions } from '../../../../../shared/functions/shared-functions';
import { MatDialog } from '@angular/material';
import { ProviderServices } from '../../../../../ynw_provider/services/provider-services.service';

@Component({
    'selector': 'app-video-settings',
    'templateUrl': './video-settings.component.html'
})
export class VideoSettingsComponent implements OnInit {
    api_loading: boolean;
    virtualCallModesList: any = [];
    skypeselected = false;
    whatsappselected = false;
    imoselected = false;
    botimselected = false;
    hangoutselected = false;
    jaldeeselected = false;
    skypeMode = '';
    whatsappMode = '';
    hangoutMode = '';
    botimMode = '';
    imoMode = '';
    jaldeeMode = '';
    breadcrumbs = [
        {
            title: 'Settings',
            url: '/provider/settings'
        },
        {
            title: 'Comm',
            url: '/provider/settings/comm'
        },
        {
            title: 'Video Call',
        }
    ];
    constructor(private _formBuilder: FormBuilder,
        private router: Router,
        public shared_functions: SharedFunctions,
        private dialog: MatDialog,
        private sharedfunctionObj: SharedFunctions,
        private provider_services: ProviderServices) {
      }
    ngOnInit() {
        this.api_loading = true;
        this.getVirtualCallingModesList();
      }

      getVirtualCallingModesList() {
        this.provider_services.getVirtualCallingModes().subscribe(
          (data: any) => {
            this.virtualCallModesList = data;
            this.api_loading = false;
            console.log(this.virtualCallModesList);
          },
          (error: any) => {
            this.api_loading = false;
          });
      }
      addVideocallMode() {
        const virtualCallingModes = [
          {
            'callingMode': 'SKYPE',
            'value': this.skypeMode,
          },
          {
            'callingMode': 'WHATSAPP',
            'value': this.whatsappMode,
          },
          {
            'callingMode': 'HANGOUTS',
            'value': this.hangoutMode,
          },
          {
            'callingMode': 'BOTIM',
            'value': this.botimMode,
          },
          {
            'callingMode': 'IMO',
            'value': this.imoMode,
          },
          {
            'callingMode': 'JALDEE_INTEGRATED_VIDEO',
            'value': this.jaldeeMode,
          },
        ];
      this.provider_services.addVirtualCallingModes(virtualCallingModes).subscribe(
        (data) => {
            this.shared_functions.openSnackBar('Virtual calling modes added successfully', { 'panelclass': 'snackbarerror' });
        },
        error => {
            this.shared_functions.openSnackBar(error, { 'panelClass': 'snackbarerror' });
        }
    );
      }
      skypeSelected(event) {
        this.skypeselected = event.checked;
    }
      whatsappSelected(event) {
      this.whatsappselected = event.checked;
    }
      hangoutSelected(event) {
      this.hangoutselected = event.checked;
    }
      botimSelected(event) {
      this.botimselected = event.checked;
    }
      imoSelected(event) {
      this.imoselected = event.checked;
    }
      jaldeeSelected(event) {
      this.jaldeeselected = event.checked;
    }

}
