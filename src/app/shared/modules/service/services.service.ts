import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';

export class ServicesService {
    serviceUpdated = new Subject<any>();
    initService = new Subject<any>();
    galleryUpdated = new Subject<any>();
    actionPerformed(serviceActionModel: any) {
        this.serviceUpdated.next(serviceActionModel);
    }
    getServiceActionModel(): Observable <any> {
        return this.serviceUpdated.asObservable();
    }
    initServiceParams(serviceParams) {
        this.initService.next(serviceParams);
    }
    getInitServiceParams(): Observable <any> {
        return this.initService.asObservable();
    }
    serviceGalleryUpdated(gallery) {
        this.galleryUpdated.next(gallery);
    }

    getUpdatedGallery(): Observable <any> {
        return this.galleryUpdated.asObservable();
    }

}
