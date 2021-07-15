import { Component, Input, OnInit } from '@angular/core';

//import { LocalStorageService } from '../../../services/local-storage.service';

@Component({
  selector: 'app-termscondition',
  templateUrl: './termscondition.component.html',
  styleUrls: ['./termscondition.component.css']
})
export class TermsconditionComponent implements OnInit {
  @Input() content;
  @Input() path;

  ngOnInit() {

  }


}
