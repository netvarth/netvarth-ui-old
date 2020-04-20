import { Component } from '@angular/core';

@Component({
    'selector': 'app-video-settings',
    'templateUrl': './video-settings.component.html'
})
export class VideoSettingsComponent {
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
}
