import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';

export class CheckInService {
    checkinUpdated = new Subject<any>();
    initCheckin = new Subject<any>();
    // galleryUpdated = new Subject<any>();
    actionPerformed(checkinActionModel: any) {
        this.checkinUpdated.next(checkinActionModel);
    }
    getCheckinActionModel(): Observable <any> {
        return this.checkinUpdated.asObservable();
    }
    initCheckinParams(serviceParams) {
        this.initCheckin.next(serviceParams);
    }
    getInitCheckinParams(): Observable <any> {
        return this.initCheckin.asObservable();
    }
    // serviceGalleryUpdated(gallery) {
    //     this.galleryUpdated.next(gallery);
    // }

    // getUpdatedGallery(): Observable <any> {
    //     return this.galleryUpdated.asObservable();
    // }
}
