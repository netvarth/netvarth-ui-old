import { Component,  Input,OnInit } from '@angular/core';

//import { LocalStorageService } from '../../../services/local-storage.service';

@Component({
    selector: 'app-refundcancel',
    templateUrl: './refundcancel.component.html',
    styleUrls: ['./refundcancel.component.css']
})
export class RefundcancelComponent implements OnInit {
  @Input() detail;
   
    constructor(
      //  private lStorageService: LocalStorageService
      ) {} 

    ngOnInit() {
    }
    
   
}
