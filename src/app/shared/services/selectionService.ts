import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class SelectionService {
    private serviceDataSource = new BehaviorSubject<any>('All');
    _service_data = this.serviceDataSource.asObservable();

    constructor() { }

    serviceSelected(data) {
        this.serviceDataSource.next(data);
    }
}
