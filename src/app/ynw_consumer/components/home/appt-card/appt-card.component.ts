import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { Messages } from '../../../../shared/constants/project-messages';
import { projectConstantsLocal } from '../../../../shared/constants/project-constants';
import { WordProcessor } from '../../../../shared/services/word-processor.service';
import { DateTimeProcessor } from '../../../../shared/services/datetime-processor.service';
@Component({
  selector: 'app-appt-card',
  templateUrl: './appt-card.component.html',
  styleUrls: ['./appt-card.component.css']
})
export class ApptCardComponent implements OnInit, OnChanges {

  @Input() booking;
  @Input() type;
  @Input() extras;
  @Output() actionPerformed = new EventEmitter<any>();

  send_msg_cap = Messages.SEND_MSG_CAP;
  rate_visit = Messages.RATE_VISIT;
  remove_fav_cap = Messages.REMOVE_FAV;
  bookingStatusClasses = projectConstantsLocal.BOOKING_STATUS_CLASS;
  monthFormat = projectConstantsLocal.DATE_FORMAT_STARTS_MONTH;
  showFavouritesBtn = false;
  showRateBtn = false;
  showRemFavouritesBtn = false;
  showRescheduleBtn = false;
  showShareLocationBtn = false;
  showJoinVideoBtn = false;
  showViewPrescritionBtn = false;
  showMoreInfoBtn = false;
  showMeetingDetailsBtn = false;
  showViewAttachBtn = false;
  showSendAttachBtn = false;
  showSendMessageBtn = false;
  showCancelBtn = false;
  showLiveTrackIdBtn = false;
  showLiveTrackBtn = false;

  showJoinJaldeeVideoBtn = false;
  showJoinOtherVideoBtn = false;
  videoBtnCaption;

  showPayBtn = false;
  showReceiptBtn = false;
  showPaidInfo = false;
  
  virtualMode;
  constructor(
    private wordProcessor: WordProcessor, 
    private dateTimeProcessor: DateTimeProcessor, 
    // private cdref: ChangeDetectorRef
    ) { }

  ngOnInit(): void {

    
  }
  ngOnChanges() {
    // this.cdref.detectChanges();
    console.log('Booking');
    console.log(this.booking);
    console.log(this.extras);
    if (this.booking.apptStatus == 'Confirmed' || this.booking.apptStatus == 'Arrived') {
      this.showRescheduleBtn = true;
    }
    if (this.booking.apptStatus == 'Confirmed' || this.booking.apptStatus == 'Arrived' || this.booking.apptStatus == 'prepaymentPending') {
      this.showCancelBtn = true;
    }
    if (this.booking.hasAttachment) {
      this.showViewAttachBtn = true;
    }
    if (this.booking.apptStatus == 'Completed') {
      this.showRateBtn = true;
    }
    if (this.booking.service.serviceType === 'virtualService' && this.booking.apptStatus !== 'Completed'
      && this.booking.apptStatus !== 'Cancelled') {
      this.showMeetingDetailsBtn = true;
    }
    if ((this.booking.apptStatus == 'Confirmed' || this.booking.apptStatus == 'Arrived')
      && this.booking.questionnaire && this.booking.questionnaire.questionAnswers &&
      this.booking.questionnaire.questionAnswers.length > 0) {
      this.showMoreInfoBtn = true;
    }
    if (this.type !== 'future' && this.booking.prescShared) {
      this.showViewPrescritionBtn = true;
    }
    if (this.type !== 'future' && !this.booking.jaldeeApptDistanceTime && this.booking.service.livetrack && this.booking.apptStatus === 'Confirmed') {
      this.showLiveTrackIdBtn = true;
    }
    if (this.type !== 'future' && (this.booking.apptStatus == 'Confirmed' || 'prepaymentPending')
      && (this.booking.jaldeeApptDistanceTime && this.booking.service.livetrack && this.booking.apptStatus === 'Confirmed')) {
      this.showLiveTrackBtn = true;
    }
    if (this.type !== 'future' && this.booking.videoCallButton && this.booking.videoCallButton==='ENABLED' && this.booking.service.serviceType === 'virtualService' && this.booking.service.virtualCallingModes.length > 0 &&
      this.booking.service.virtualCallingModes[0].callingMode === 'VideoCall' &&
      (this.booking.apptStatus === 'Started' || this.booking.apptStatus === 'Arrived' || this.booking.apptStatus === 'Confirmed')) {
      this.showJoinJaldeeVideoBtn = true;
      this.showJoinOtherVideoBtn = false;
      this.videoBtnCaption = 'Join Video Consultation';
      if (this.booking.videoCallMessage && this.booking.videoCallMessage === 'Call in progress') {
        this.videoBtnCaption = 'Re-join Video Consultation';
      }
    }
    if (this.type !== 'future' && this.booking.videoCallButton && this.booking.videoCallButton==='ENABLED' && this.booking.service.serviceType === 'virtualService' && this.booking.service.virtualCallingModes.length > 0 &&
      (this.booking.service.virtualCallingModes[0].callingMode === 'Zoom' || this.booking.service.virtualCallingModes[0].callingMode === 'GoogleMeet')
      && (this.booking.apptStatus === 'Started' || this.booking.apptStatus === 'Arrived' || this.booking.apptStatus === 'Confirmed')) {
      this.showJoinJaldeeVideoBtn = false;
      this.showJoinJaldeeVideoBtn = true;
      this.videoBtnCaption = 'Join Video Consultation';
      if (this.booking.videoCallMessage && this.booking.videoCallMessage === 'Call in progress') {
        this.videoBtnCaption = 'Re-join Video Consultation';
      }
    }
    if(this.booking.amountDue>0 && (this.booking.billViewStatus=='Show') && this.booking.apptStatus != 'Cancelled' 
    && this.booking.apptStatus != 'Rejected' && this.booking.billStatus!='Settled'){
      this.showPayBtn = true
    }
    if (this.booking.billViewStatus == 'Show' && 
    ((!(this.booking.amountDue>0) && this.booking.apptStatus != 'Cancelled' && this.booking.apptStatus != 'Rejected')
     || (this.booking.apptStatus === 'Cancelled' || this.booking.apptStatus === 'Rejected' && this.booking.paymentStatus !== 'NotPaid'))){
      this.showReceiptBtn = true;
    }
    if(this.booking.amountPaid){
      this.showPaidInfo = true;
    }
    if (!this.checkIfFav(this.booking.providerAccount.id)) {
      this.showFavouritesBtn = true;
      this.showRemFavouritesBtn = false;
    } else {
      this.showFavouritesBtn = false;
      this.showRemFavouritesBtn = true;
    }
  }
  checkIfFav(id) {
    let fav = false;
    this.extras['favourites'].map((e) => {
      if (e === id) {
        fav = true;
      }
    });
    return fav;
  }
  cardActionPerformed(type, action, booking, event) {
    console.log(booking);
    // event.stopPropagation();
    const actionObj = {};
    actionObj['type'] = type;
    actionObj['action'] = action;
    actionObj['booking'] = booking;
    actionObj['event'] = event;
    this.actionPerformed.emit(actionObj);
  }
  getBookingStatusClass(status) {
    const retdet = this.bookingStatusClasses.filter(
      soc => soc.value === this.wordProcessor.firstToUpper(status));
    if (retdet[0]) {
      return retdet[0].class;
    } else {
      return '';
    }
  }
  getTimeToDisplay(min) {
    return this.dateTimeProcessor.convertMinutesToHourMinute(min);
  }
  getSingleTime(slot) {
    const slots = slot.split('-');
    return this.dateTimeProcessor.convert24HourtoAmPm(slots[0]);
  }
  stopprop(event) {
    event.stopPropagation();
  }
}
