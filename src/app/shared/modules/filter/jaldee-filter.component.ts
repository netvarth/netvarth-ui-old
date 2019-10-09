import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-jaldee-filter',
    templateUrl: './jaldee-filter.component.html'
})
export class JaldeeFilterComponent {
    @Input() fields: any;

}
