import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LocalStorageService } from '../../shared/services/local-storage.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
  partnerParentId: any;
  constructor(
    private router: Router,
    private lStorageService: LocalStorageService
  ) { }

  ngOnInit(): void {
    this.partnerParentId = this.lStorageService.getitemfromLocalStorage('partnerParentId');
  }


  goHome() {
    this.router.navigate([this.partnerParentId, 'partner']);
  }

  allLoans() {
    this.router.navigate([this.partnerParentId, 'partner', 'loans']);
  }

  createLoan() {
    this.router.navigate([this.partnerParentId, 'partner', 'loans', 'create']);
  }

}
