
import { LazySrcDirective } from './lazysrc.directive';
import { NgModule } from '@angular/core';
import { LazyViewPort } from './lazytarget';
import { LazyViewportDirective } from './lazy-viewport.directive';

@NgModule({
    declarations: [
        LazySrcDirective,
        LazyViewportDirective
    ],
    exports: [
        LazySrcDirective,
        LazyViewportDirective
    ],
    providers: [
        {
            provide: LazyViewPort,
            useFactory: function() {
                const viewport = new LazyViewPort();
                viewport.setup();
                return(viewport);
            }
        }
    ]
})

export class LazyModule {}
