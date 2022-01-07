// Angular
import { Injectable, OnDestroy } from '@angular/core';
import { Router, NavigationError } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { ServiceMeta } from '../../services/service-meta';

@Injectable()
export class ChunkErrorHandler implements OnDestroy {
    private subscription: Subscription;

    constructor(router: Router, private servicemeta: ServiceMeta) {
        this.subscription = router.events
            .pipe(filter(event => event instanceof NavigationError))
            .subscribe(event => {
                this.handleRouterErrors(event as NavigationError);
            });
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    callHealth(message) {
        const url = 'health/browser';
        return this.servicemeta.httpPost(url, message);
    }

    private handleRouterErrors(event: NavigationError) {
        this.callHealth(event);
        if (event.error.name === 'ChunkLoadError') {
            window.location.href = `${window.location.origin}${event.url}`;
        }
    }


}
