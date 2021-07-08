import { Component,  Input,OnInit } from '@angular/core';

//import { LocalStorageService } from '../../../services/local-storage.service';

@Component({
    selector: 'app-contact',
    templateUrl: './contact.component.html',
    styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit {
    @Input() detail;
   
    constructor(
      //  private lStorageService: LocalStorageService
      ) {} 

    ngOnInit() {
       
    }
    
   
}
