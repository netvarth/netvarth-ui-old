import { Component, OnInit, Input } from '@angular/core';
@Component({
    selector: 'app-common-innerloading-spinner',
    templateUrl: './loading-spinner.component.html',
    styleUrls: ['./loading-spinner.component.css']
})

export class LoadingSpinnerComponent implements OnInit {
    @Input() spinnerParams: any = [];
    diameter;
    stroke;
    constructor() { }

    ngOnInit() {
        this.diameter = (this.spinnerParams['diameter']) ? this.spinnerParams['diameter'] : 40;
        this.stroke = (this.spinnerParams['strokewidth']) ? this.spinnerParams['strokewidth'] : 5;
    }
}
