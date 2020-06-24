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
    virtualCallingMode_status: any;
    virtualCallingMode_statusstr: string;
    // callingmodes: any = [];
    videoModes = {
        // Skype: { value: 'Skype', displayName: 'Skype', placeHolder: 'Skype ID', titleHelp: 'Configure Skype Settings', actualValue: '', enabled: false },
        WhatsApp: { value: 'WhatsApp', displayName: 'WhatsApp', placeHolder: 'WhatsApp ID', titleHelp: 'Configure WhatsApp Settings', actualValue: '', enabled: false },
        // Hangouts: { value: 'Hangouts', displayName: 'Hangouts', placeHolder: 'Hangouts ID', titleHelp: 'Configure Hangouts Settings', actualValue: '', enabled: false },
        // Botim: { value: 'Botim', displayName: 'BOTIM', placeHolder: 'BOTIM ID', titleHelp: 'Configure BOTIM Settings', actualValue: '', enabled: false },
        // Imo: { value: 'Imo', displayName: 'IMO', placeHolder: 'IMO ID', titleHelp: 'Configure IMO Settings', actualValue: '', enabled: false },
        Zoom: { value: 'Zoom', displayName: 'Zoom', placeHolder: 'Zoom ID', titleHelp: 'Configure Zoom Settings', actualValue: '', enabled: false },
        // Viber: { value: 'Viber', displayName: 'Viber', placeHolder: 'Viber ID', titleHelp: 'Configure Viber Settings', actualValue: '', enabled: false }
    };
    breadcrumb_moreoptions: any = [];
    breadcrumbs = [
        { title: 'Settings', url: '/provider/settings' },
        { title: 'Communications And Notifications', url: '/provider/settings/comm' },
        { title: 'Teleservice' }
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
        this.getGlobalSettingsStatus();
    }

    getGlobalSettingsStatus() {
        this.provider_services.getGlobalSettings().subscribe(
            (data: any) => {
                this.virtualCallingMode_status = data.virtualService;
                this.virtualCallingMode_statusstr = (this.virtualCallingMode_status) ? 'On' : 'Off';
            });
    }
    handle_virtualCallingModeStatus(event) {
        const is_VirtualCallingMode = (event.checked) ? 'Enable' : 'Disable';
        this.provider_services.setVirtualCallingMode(is_VirtualCallingMode)
            .subscribe(
                () => {
                    this.shared_functions.openSnackBar('Teleservice ' + is_VirtualCallingMode + 'd successfully', { ' panelclass': 'snackbarerror' });
                    this.getGlobalSettingsStatus();
                },
                error => {
                    this.shared_functions.openSnackBar(error, { 'panelClass': 'snackbarerror' });
                    this.getGlobalSettingsStatus();
                }
            );
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
                    this.videoModes[mode.callingMode].actualValue = mode.value;
                    if (mode.status && mode.status === 'ACTIVE') {
                        this.videoModes[mode.callingMode].enabled = true;
                    } else {
                        this.videoModes[mode.callingMode].enabled = false;
                    }
                });
                this.api_loading = false;
            },
            (error: any) => {
                this.api_loading = false;
            });
    }
    triggerChange(resultMode, callingMode) {
        if (resultMode['value'].actualValue.trim() !== '') {
            this.updateVideoSettings(resultMode, callingMode, 'statuschange');
        } else {
            if (!resultMode.value.enabled) {
                this.updateVideoSettings(resultMode, callingMode, 'statuschange');
            } else {
                this.videoModes[callingMode].enabled = false;
            }
        }
    }
    updateVideoSettings(resultMode, callingMode, statuschange?) {
        const virtualCallingModes = [];

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
        const postdata = {
            'virtualCallingModes': virtualCallingModes
        };
        this.provider_services.addVirtualCallingModes(postdata).subscribe(
            (data) => {
                // this.callingmodes = postdata.virtualCallingModes;
                // for (let i = 0; i < this.callingmodes.length; i++){
                //     if (this.callingmodes[i].callingMode === 'WhatsApp'){
                //         this.shared_functions.openSnackBar('Whatsapp mode added successfully', { 'panelclass': 'snackbarerror' });
                //         this.getVirtualCallingModesList();
                //     }else if (this.callingmodes[i].callingMode === 'Zoom') {
                //         this.shared_functions.openSnackBar('Zoom mode added successfully', { 'panelclass': 'snackbarerror' });
                //         this.getVirtualCallingModesList();
                //     }
                // }
                if (callingMode === 'WhatsApp') {
                    if (statuschange) {
                        let status = 'disabled';
                        if (resultMode.value.enabled) {
                            status = 'enabled';
                        }
                        this.shared_functions.openSnackBar('Whatsapp mode ' + status + ' successfully', { 'panelclass': 'snackbarerror' });
                    } else {
                        this.shared_functions.openSnackBar('Whatsapp mode added successfully', { 'panelclass': 'snackbarerror' });
                    }
                    this.getVirtualCallingModesList();
                } else if (callingMode === 'Zoom') {
                    if (statuschange) {
                        let status = 'disabled';
                        if (resultMode.value.enabled) {
                            status = 'enabled';
                        }
                        this.shared_functions.openSnackBar('Zoom mode ' + status + ' successfully', { 'panelclass': 'snackbarerror' });

                    } else {
                        this.shared_functions.openSnackBar('Zoom mode added successfully', { 'panelclass': 'snackbarerror' });
                    }
                    this.getVirtualCallingModesList();
                }
                // for (let callingmodes of postdata.virtualCallingModes) {
                //     if (callingmodes.callingMode === 'WhatsApp'){
                //         this.shared_functions.openSnackBar('Whatsapp mode added successfully', { 'panelclass': 'snackbarerror' });
                //         this.getVirtualCallingModesList();
                //     }else if (callingmodes.callingMode === 'Zoom') {
                //         this.shared_functions.openSnackBar('Zoom mode added successfully', { 'panelclass': 'snackbarerror' });
                //         this.getVirtualCallingModesList();
                //     }
                // }
                // if (postdata.virtualCallingModes[0].callingMode === 'WhatsApp') {
                //     this.shared_functions.openSnackBar('Whatsapp mode added successfully', { 'panelclass': 'snackbarerror' });
                //     this.getVirtualCallingModesList();
                // } else if (postdata.virtualCallingModes[0].callingMode === 'Zoom') {
                //     this.shared_functions.openSnackBar('Zoom mode added successfully', { 'panelclass': 'snackbarerror' });
                //     this.getVirtualCallingModesList();
                // }
            },
            error => {
                this.shared_functions.openSnackBar(error, { 'panelClass': 'snackbarerror' });
            }
        );
    }
    learnmore_clicked(mod, e) {
        e.stopPropagation();
        this.router.navigate(['/provider/' + this.domain + '/comm->' + mod]);
    }
}
