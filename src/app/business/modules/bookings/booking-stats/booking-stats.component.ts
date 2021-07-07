import { Component, Input, OnInit } from '@angular/core';
import { WordProcessor } from '../../../../shared/services/word-processor.service';

@Component({
  selector: 'app-booking-stats',
  templateUrl: './booking-stats.component.html',
  styleUrls: ['./booking-stats.component.css']
})
export class BookingStatsComponent implements OnInit {
  customer_label = '';
  @Input() newApptsCount;
  @Input() newWitlistCount;
  @Input() waitlistMgrSettings;
  @Input() ordersCount;
  @Input() donationsCount;
  @Input() customer_count;
  @Input() admin;
  constructor(private wordProcessor: WordProcessor) {}

  ngOnInit(): void {
    this.customer_label = this.wordProcessor.getTerminologyTerm('customer');
  }
}
