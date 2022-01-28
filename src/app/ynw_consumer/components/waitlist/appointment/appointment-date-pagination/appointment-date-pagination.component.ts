import { Component, OnInit, Output ,EventEmitter } from '@angular/core';
import { ConsumerCheckinComponent } from '../../check-in/consumer-checkin.component';

@Component({
  selector: 'app-appointment-date-pagination',
  templateUrl: './appointment-date-pagination.component.html',
  styleUrls: ['./appointment-date-pagination.component.css']
})
export class AppointmentDatePaginationComponent extends ConsumerCheckinComponent implements OnInit {
    @Output() date_change_event = new EventEmitter();
    minDate:any;
    selected_date:any;
    default_value:String;
    next_date_value: string;
    next_date_value_1: string;
    next_date_value_2: string;
    month = ["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"];
    week = ["SUN","MON","TUE","WED","THU","FRI","SAT"];
    prev_date_value: string;
    prev_date_value_1: string;
    prev_date_value_2: string;
    previous_date_handling_btn: boolean;
    selected_checkin_date: any;
    ngOnInit(): void {
      this.minDate = this.sel_checkindate;
      this.previous_date_handling_btn = false;
      let today_date1 = new Date(this.sel_checkindate);
      this.default_value =  this.week[today_date1.getDay()]+this.month[today_date1.getMonth()]+today_date1.getDate();
      today_date1.setDate(today_date1.getDate() + 1);
      this.next_date_value =  this.week[today_date1.getDay()]+this.month[today_date1.getMonth()]+today_date1.getDate();
      today_date1.setDate(today_date1.getDate() + 1);
      this.next_date_value_1 =  this.week[today_date1.getDay()]+this.month[today_date1.getMonth()]+today_date1.getDate();
      today_date1.setDate(today_date1.getDate() + 1);
      this.next_date_value_2 =  this.week[today_date1.getDay()]+this.month[today_date1.getMonth()]+today_date1.getDate();
      today_date1.setDate(today_date1.getDate() - 4);
      this.prev_date_value =  this.week[today_date1.getDay()]+this.month[today_date1.getMonth()]+today_date1.getDate();
      today_date1.setDate(today_date1.getDate() - 1);
      this.prev_date_value_1 =  this.week[today_date1.getDay()]+this.month[today_date1.getMonth()]+today_date1.getDate();
      today_date1.setDate(today_date1.getDate() - 1);
      this.prev_date_value_2 =  this.week[today_date1.getDay()]+this.month[today_date1.getMonth()]+today_date1.getDate();
      this.date_change_event.emit(this.sel_checkindate);
    }

  next_date(n)
  {
    let tommorow = new Date(this.sel_checkindate);
    tommorow.setDate(tommorow.getDate() + n);
    this.default_value =  this.week[tommorow.getDay()]+this.month[tommorow.getMonth()]+tommorow.getDate();
    this.sel_checkindate =  new Date(tommorow).toISOString().slice(0, 10);
    this.selectedDate = this.sel_checkindate;
    tommorow = new Date(this.sel_checkindate);
    tommorow.setDate(tommorow.getDate() + 1);
    this.next_date_value =  this.week[tommorow.getDay()]+this.month[tommorow.getMonth()]+tommorow.getDate();
    tommorow.setDate(tommorow.getDate() + 1);
    this.next_date_value_1 =  this.week[tommorow.getDay()]+this.month[tommorow.getMonth()]+tommorow.getDate();
    tommorow.setDate(tommorow.getDate() + 1);
    this.next_date_value_2 =  this.week[tommorow.getDay()]+this.month[tommorow.getMonth()]+tommorow.getDate();
    tommorow.setDate(tommorow.getDate() - 4);
    this.prev_date_value =  this.week[tommorow.getDay()]+this.month[tommorow.getMonth()]+tommorow.getDate();
    tommorow.setDate(tommorow.getDate() - 1);
    this.prev_date_value_1 =  this.week[tommorow.getDay()]+this.month[tommorow.getMonth()]+tommorow.getDate();
    tommorow.setDate(tommorow.getDate() - 1);
    this.prev_date_value_2 =  this.week[tommorow.getDay()]+this.month[tommorow.getMonth()]+tommorow.getDate();
    this.date_change_event.emit(this.sel_checkindate);

  }


  prev_date(n)
  {
      let yesterday = new Date(this.sel_checkindate);
      yesterday.setDate(yesterday.getDate() - n);
      this.default_value =  this.week[yesterday.getDay()]+this.month[yesterday.getMonth()]+yesterday.getDate();
      this.sel_checkindate =  new Date(yesterday).toISOString().slice(0, 10);
      this.selectedDate = this.sel_checkindate;
      yesterday = new Date(this.sel_checkindate);
      yesterday.setDate(yesterday.getDate() - 1);
      this.prev_date_value =  this.week[yesterday.getDay()]+this.month[yesterday.getMonth()]+yesterday.getDate();
      yesterday.setDate(yesterday.getDate() - 1);
      this.prev_date_value_1 =  this.week[yesterday.getDay()]+this.month[yesterday.getMonth()]+yesterday.getDate();
      yesterday.setDate(yesterday.getDate() - 1);
      this.prev_date_value_2 =  this.week[yesterday.getDay()]+this.month[yesterday.getMonth()]+yesterday.getDate();
      yesterday.setDate(yesterday.getDate() + 4);
      this.next_date_value =  this.week[yesterday.getDay()]+this.month[yesterday.getMonth()]+yesterday.getDate();
      yesterday.setDate(yesterday.getDate() + 1);
      this.next_date_value_1 =  this.week[yesterday.getDay()]+this.month[yesterday.getMonth()]+yesterday.getDate();
      yesterday.setDate(yesterday.getDate() + 1);
      this.next_date_value_2 =  this.week[yesterday.getDay()]+this.month[yesterday.getMonth()]+yesterday.getDate();
      this.date_change_event.emit(this.sel_checkindate);

  }

  date_value_changed()
  {
    this.next_date(0);
    this.date_change_event.emit(this.sel_checkindate);
    this.selectedDate = this.sel_checkindate;
    this.date_handling_btn();
  }

  date_handling_btn()
  {
    let min_date_value = new Date(this.minDate)
    const checking_date_value = this.week[min_date_value.getDay()]+this.month[min_date_value.getMonth()]+min_date_value.getDate();
    
    if(checking_date_value == this.default_value)
    {
      this.previous_date_handling_btn = false;
    }
    else
    {
      this.previous_date_handling_btn = true;
    }
  }

}
