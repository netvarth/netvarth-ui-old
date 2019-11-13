import { Component, OnInit, Input, Output, EventEmitter,Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { SharedServices } from '../../../services/shared-services';
import { SharedFunctions } from '../../../functions/shared-functions';
import { DOCUMENT } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';
@Component({
  selector: 'app-livetrack',
  templateUrl: './livetrack.component.html',
  // styleUrls: ['./home.component.scss']
})
export class LivetrackComponent {
    constructor(public dialogRef: MatDialogRef<LivetrackComponent>, 
        private shared_services: SharedServices,
        public shared_functions: SharedFunctions,
        @Inject (MAT_DIALOG_DATA) public data: any,
        @Inject(DOCUMENT) public document,
        public _sanitizer: DomSanitizer) { }

        
     
}
