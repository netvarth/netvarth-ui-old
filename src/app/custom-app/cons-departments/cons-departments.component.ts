import { Component, Input, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { LocalStorageService } from '../../shared/services/local-storage.service';

@Component({
  selector: 'app-cons-departments',
  templateUrl: './cons-departments.component.html',
  styleUrls: ['./cons-departments.component.css']
})
export class ConsDepartmentsComponent implements OnInit {

  @Input() selectedLocation;
  @Input() terminologiesjson;
  @Input() templateJson;
  @Input() businessProfile;
  @Input() departments;

  constructor(private router: Router,
    private lStorageService: LocalStorageService) { }

  ngOnInit(): void {
  }

  cardClicked(actionObj) {
    let deptId = actionObj['userId'];
    const customId = this.lStorageService.getitemfromLocalStorage('customId');
    let queryParams = {};
    if(this.templateJson['theme']) {
      queryParams['theme'] = this.templateJson['theme'];
    }
    const navigationExtras: NavigationExtras = {
      queryParams: queryParams
    };
    this.router.navigate([customId, 'department',deptId], navigationExtras);
  }
}
