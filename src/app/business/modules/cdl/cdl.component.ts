import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GroupStorageService } from '../../../../../src/app/shared/services/group-storage.service';

@Component({
  selector: 'app-cdl',
  templateUrl: './cdl.component.html',
  styleUrls: ['./cdl.component.css']
})
export class CdlComponent implements OnInit {
  user: any;
  constructor(
    private groupService: GroupStorageService,
    private router: Router

  ) { }

  ngOnInit(): void {
    this.user = this.groupService.getitemFromGroupStorage('ynw-user');
    console.log("User is", this.user);
  }


  CreateLoan() {
    this.router.navigate(['provider', 'cdl', 'loans', 'create']);
  }

  ApprovedLoans() {
    this.router.navigate(['provider', 'cdl', 'loans', 'approved']);
  }
}

