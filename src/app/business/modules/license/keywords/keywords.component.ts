import { Component } from '@angular/core';

@Component({
    selector: 'app-keywords',
    templateUrl: './keywords.component.html'
})

export class KeywordsComponent {
    breadcrumbs = [
        {
            title: 'License & Invoice',
            url: '/provider/license'
        },
        {
            title: 'Jaldee-Keywords'
        }
    ];
}
