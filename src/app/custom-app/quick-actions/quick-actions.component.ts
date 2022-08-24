import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-quick-actions',
  templateUrl: './quick-actions.component.html',
  styleUrls: ['./quick-actions.component.css']
})
export class QuickActionsComponent implements OnInit {
  @Input() actionList;
  // title: any;
  // description: any;
  // image: any;
  // quickactions: any;
  constructor(private router:Router) { }
  
  ngOnInit(): void {
    console.log("file",this.actionList);
    
    
  }
  cardActionPerformed(action) {
    if (action.link) {
        this.router.navigateByUrl(action.link);
    }
  }
}
