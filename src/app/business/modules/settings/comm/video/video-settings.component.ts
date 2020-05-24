import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { SharedFunctions } from '../../../../../shared/functions/shared-functions';
import { MatDialog } from '@angular/material';
import { ProviderServices } from '../../../../../ynw_provider/services/provider-services.service';
import { KeyValue } from '@angular/common';

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
    domain: any;

    videoModes = {
        SKYPE: { value: 'SKYPE', displayName: 'Skype', placeHolder: 'Skype ID', titleHelp: 'Configure Skype Settings', actualValue: '', enabled: false },
        WHATSAPP: { value: 'WHATSAPP', displayName: 'WhatsApp', placeHolder: 'WhatsApp ID', titleHelp: 'Configure WhatsApp Settings', actualValue: '', enabled: false },
        HANGOUTS: { value: 'HANGOUTS', displayName: 'Hangouts', placeHolder: 'Hangouts ID', titleHelp: 'Configure Hangouts Settings', actualValue: '', enabled: false },
        BOTIM: { value: 'BOTIM', displayName: 'BOTIM', placeHolder: 'BOTIM ID', titleHelp: 'Configure BOTIM Settings', actualValue: '', enabled: false },
        IMO: { value: 'IMO', displayName: 'IMO', placeHolder: 'IMO ID', titleHelp: 'Configure IMO Settings', actualValue: '', enabled: false },
        ZOOM: { value: 'ZOOM', displayName: 'Zoom', placeHolder: 'Zoom ID', titleHelp: 'Configure Zoom Settings', actualValue: '', enabled: false },
        VIBER: { value: 'VIBER', displayName: 'Viber', placeHolder: 'Viber ID', titleHelp: 'Configure Viber Settings', actualValue: '', enabled: false }
    };
    breadcrumb_moreoptions: any = [];
    breadcrumbs = [
        { title: 'Settings', url: '/provider/settings' },
        { title: 'Comm.', url: '/provider/settings/comm' },
        { title: 'Video Call' }
    ];
    originalOrder = (a: KeyValue<number, string>, b: KeyValue<number, string>): number => {
        return 0;
    }
    constructor(private _formBuilder: FormBuilder,
        private router: Router,
        public shared_functions: SharedFunctions,
        private provider_services: ProviderServices) {
    }
    ngOnInit() {
        this.api_loading = true;
        const user = this.shared_functions.getitemFromGroupStorage('ynw-user');
        this.domain = user.sector;
        this.breadcrumb_moreoptions = {
            'show_learnmore': true, 'scrollKey': 'comm->videocall-settings',
            'actions': [
                { 'title': 'Help', 'type': 'learnmore' }]
        };
        this.getVirtualCallingModesList();
    }

    performActions(action) {
        if (action === 'learnmore') {
            this.router.navigate(['/provider/' + this.domain + '/comm->videocall-settings']);
        }
    }

    getVirtualCallingModesList() {
        this.provider_services.getVirtualCallingModes().subscribe(
            (data: any) => {
                this.virtualCallModesList = data.virtualCallingModes;
                this.virtualCallModesList.forEach(mode => {
                    console.log(mode);
                    this.videoModes[mode.callingMode].actualValue = mode.value;
                    if (mode.status && mode.status === 'ACTIVE') {
                        this.videoModes[mode.callingMode].enabled = true;
                    } else {
                        this.videoModes[mode.callingMode].enabled = false;
                    }
                });
                this.api_loading = false;
                console.log(this.virtualCallModesList);
            },
            (error: any) => {
                this.api_loading = false;
            });
    }
    triggerChange(resultMode, callingMode) {
        if (resultMode['value'].actualValue.trim() !== '' ) {
            this.updateVideoSettings(resultMode, callingMode);
        } else {
            if (!resultMode.value.enabled) {
                this.updateVideoSettings(resultMode, callingMode);
            } else {
                this.videoModes[callingMode].enabled = false;
            }
        }
    }
    updateVideoSettings(resultMode, callingMode) {
        const virtualCallingModes = [];
        console.log(resultMode);
        console.log(callingMode);

        // Object.keys(this.videoModes).forEach(key => {

        // });
        let found = false;
        this.virtualCallModesList.forEach(modes => {
            if (modes.callingMode === callingMode) {
                let status = 'INACTIVE';
                if (resultMode.value.enabled) {
                    status = 'ACTIVE';
                }
                const mode = {
                    'callingMode': callingMode,
                    'value': resultMode['value'].actualValue,
                    'status': status
                };
                virtualCallingModes.push(mode);
                found = true;
            } else {
                virtualCallingModes.push(modes);
            }
        });

        if (!found) {
            let status = 'INACTIVE';
            if (resultMode.value.enabled) {
                status = 'ACTIVE';
            }
            const mode = {
                'callingMode': callingMode,
                'value': resultMode['value'].actualValue,
                'status': status
            };
            virtualCallingModes.push(mode);
        }
        console.log(virtualCallingModes);
        const postdata = {
            'virtualCallingModes': virtualCallingModes
        };
        console.log(postdata)
        this.provider_services.addVirtualCallingModes(postdata).subscribe(
            (data) => {
                this.shared_functions.openSnackBar('Virtual calling modes added successfully', { 'panelclass': 'snackbarerror' });
                this.getVirtualCallingModesList();
            },
            error => {
                this.shared_functions.openSnackBar(error, { 'panelClass': 'snackbarerror' });
            }
        );
    }
}
