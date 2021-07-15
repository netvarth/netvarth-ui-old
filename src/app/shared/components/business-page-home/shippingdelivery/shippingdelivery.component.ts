import { Component,  Input,OnInit } from '@angular/core';

//import { LocalStorageService } from '../../../services/local-storage.service';

@Component({
    selector: 'app-shippingdelivery',
    templateUrl: './shippingdelivery.component.html',
    styleUrls: ['./shippingdelivery.component.css']
})
export class ShippingdeliveryComponent implements OnInit {
  @Input() detail;
   
    constructor(
      //  private lStorageService: LocalStorageService
      ) {} 

    ngOnInit() {
    }
    
   
}
