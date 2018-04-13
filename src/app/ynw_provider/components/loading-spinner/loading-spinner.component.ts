import { Component, OnInit, Input } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
@Component({
    selector: 'app-innerloading-spinner',
    templateUrl: './loading-spinner.component.html',
    styleUrls: ['./loading-spinner.component.scss']
})

export class LoadingSpinnerComponent implements OnInit {
    @Input() spinnerParams: any = [];
    diameter;
    stroke;
    constructor() {}

    ngOnInit() {
        this.diameter = (this.spinnerParams['diameter']) ? this.spinnerParams['diameter'] : 40;
        this.stroke = (this.spinnerParams['strokewidth']) ? this.spinnerParams['strokewidth'] : 5;
    }
}
