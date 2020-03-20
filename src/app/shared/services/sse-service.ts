import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class SseService {
    /**
     * Creates event source
     * @param url
     */
    getEventSouce(url: string): EventSource {
        return new EventSource(url, { withCredentials: true });
    }
}
