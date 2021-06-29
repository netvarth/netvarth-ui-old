import { Component, Input, OnInit } from '@angular/core';
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
  @Input() source;
  @Input() newApptsCount;
  @Input() newWitlistCount;
  @Input() waitlistMgrSettings;
  constructor(private provider_services: ProviderServices,
    private wordProcessor: WordProcessor) { }

  ngOnInit(): void {
    this.customer_label = this.wordProcessor.getTerminologyTerm('customer');
    this.getCustomersListCount();
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
