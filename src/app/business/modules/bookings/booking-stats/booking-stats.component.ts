import { Component, Input, OnInit } from '@angular/core';
import { GroupStorageService } from '../../../../shared/services/group-storage.service';
import { WordProcessor } from '../../../../shared/services/word-processor.service';
import { ProviderServices } from '../../../../ynw_provider/services/provider-services.service';

@Component({
  selector: 'app-booking-stats',
  templateUrl: './booking-stats.component.html',
  styleUrls: ['./booking-stats.component.css']
})
export class BookingStatsComponent implements OnInit {
  customer_count;
  customer_label = '';
  @Input() newApptsCount;
  @Input() newWitlistCount;
  @Input() waitlistMgrSettings;
  admin = true;
  constructor(private provider_services: ProviderServices,
    private wordProcessor: WordProcessor,
    private groupService: GroupStorageService) { }

  ngOnInit(): void {
    this.customer_label = this.wordProcessor.getTerminologyTerm('customer');
    this.getCustomersListCount();
    const userDet = this.groupService.getitemFromGroupStorage('ynw-user');
    if (userDet.accountType !== 'BRANCH' || userDet.accountType === 'BRANCH' && userDet.adminPrivilege) {
      this.admin = true;
    }
  }
  getCustomersListCount() {
    this.provider_services.getProviderCustomersCount()
      .subscribe(
        data => {
          this.customer_count = data;
        },
        error => {
        }
      );
  }
}
