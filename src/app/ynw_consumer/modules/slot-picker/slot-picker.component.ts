import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-slot-picker',
  templateUrl: './slot-picker.component.html',
  styleUrls: ['./slot-picker.component.css']
})
export class SlotPickerComponent implements OnInit {

  @Input() slots;
  @Input() selectedSlot;
  @Output() slotSelected = new EventEmitter<any>();
  @Input() mode;
  showMoreAvailableSlots = false;

  ngOnInit(): void {
    console.log("Slots:", this.slots);
    if (!this.selectedSlot) {
      this.selectedSlot = this.slots[0];
      this.slotSelected.emit(this.selectedSlot);
    }
  }
  slotPicked(slot) {
    this.selectedSlot = slot;
    this.slotSelected.emit(slot);
  }
  showMoreTimeSlots() {
    this.showMoreAvailableSlots = !this.showMoreAvailableSlots;
  }
}