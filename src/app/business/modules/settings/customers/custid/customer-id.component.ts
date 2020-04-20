import { Component } from '@angular/core';

@Component({
    'selector': 'app-custid',
    'templateUrl': './customer-id.component.html'
})
export class CustomerIdSettingsComponent {
    breadcrumbs = [
        {
            title: 'Settings',
            url: '/provider/settings'
        },
        {
            title: 'Customers',
            url: '/provider/settings/customers'
        },
        {
            title: 'Customer Id'
        }
    ];
}
