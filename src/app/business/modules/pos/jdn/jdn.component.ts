import { Component, OnInit } from '@angular/core';
import { Messages } from '../../../../shared/constants/project-messages';

@Component({
    selector: 'app-jdn',
    templateUrl: './jdn.component.html'
})
export class JDNComponent implements OnInit {
    jdn_full_cap = Messages.JDN_FUL_CAP;
    breadcrumbs = [
        {
            title: 'Settings',
            url: '/provider/settings'
        },
        {
            title: 'Billing/POS',
            url: '/provider/settings/pos'
        },
        {
            title: 'JDN'
        }
    ];
    ngOnInit () {

    }
}
