import { Component, OnInit, Input } from '@angular/core';
@Component({
    selector: 'app-common-innerloading-spinner',
    templateUrl: './common-loading-spinner.component.html',
    styleUrls: ['./common-loading-spinner.component.scss']
})

export class CommonLoadingSpinnerComponent implements OnInit {
    @Input() spinnerParams: any = [];
    diameter;
    stroke;
    constructor() { }
    ngOnInit() {
        this.diameter = (this.spinnerParams['diameter']) ? this.spinnerParams['diameter'] : 40;
        this.stroke = (this.spinnerParams['strokewidth']) ? this.spinnerParams['strokewidth'] : 5;
    }
}

