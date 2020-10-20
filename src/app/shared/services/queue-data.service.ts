import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';



@Injectable()
export class QueueDataService {
  private serviceDataSource = new BehaviorSubject<any>('All');
  _service_data = this.serviceDataSource.asObservable();
  private scheduleData = new BehaviorSubject<any>('All');
  _schedule_data = this.scheduleData.asObservable();
  private queueData = new BehaviorSubject<any>('All');
  _queue_data = this.queueData.asObservable();
  private customerData = new BehaviorSubject<any>('All');
  _customers = this.customerData.asObservable();
  private reportData = new BehaviorSubject<any>({});
  _reports = this.reportData.asObservable();


  constructor() {
    console.log(this._service_data);
   }

  updatedServiceDataSelection(data) {
    console.log(data);
    this.serviceDataSource.next(data);
  }
  updatedScheduleDataSelection(data) {
    this.scheduleData.next(data);
  }

  updatedQueueDataSelection(data) {
    this.queueData.next(data);
  }
  updateCustomers(data) {
    this.customerData.next(data);

  }
  storeSelectedValues(data?) {
    this.reportData.next(data);
  }

  getReport() {
    return JSON.parse(localStorage.getItem('report'));
  }
}
