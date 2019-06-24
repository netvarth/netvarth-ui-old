import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProviderServices } from '../../services/provider-services.service';
import { ProviderDataStorageService } from '../../services/provider-datastorage.service';
import { QuestionService } from '../dynamicforms/dynamic-form-question.service';

@Component({
  selector: 'app-provider-virtual-fields',
  templateUrl: './virtual-fields.component.html'
})

export class VirtualFieldsComponent implements OnInit {


  bProfile = null;
  questions = [];

  constructor(private provider_services: ProviderServices,
    private provider_datastorage: ProviderDataStorageService,
    private service: QuestionService,
    private router: Router) { }

  ngOnInit() {
    this.bProfile = this.provider_datastorage.get('bProfile');
    if (this.bProfile && this.bProfile['serviceSector']['domain']) {
      this.getVirtualFields(this.bProfile['serviceSector']['domain']);
    } else {
      this.router.navigate(['/provider/profile-search-menu']);
    }
  }

  getVirtualFields(domain) {
    this.provider_services.getVirtualFields('autoMobile')
      .subscribe(
        data => {
          this.questions = this.service.getQuestions(data);
        },
        () => {
        }
      );
  }
}
