import { Directive, OnInit, OnDestroy, ElementRef } from '@angular/core';
import { LazyViewPort } from './lazytarget';

@Directive({
    selector: '[lazyViewport]',
    // tslint:disable-next-line:use-input-property-decorator
    inputs: [ 'offset: lazyViewportOffset'],

    providers: [
        {
            provide: LazyViewPort,
            useClass: LazyViewPort
        }
    ]
})

export class LazyViewportDirective implements OnInit, OnDestroy {
    public offset: number;
    private elementRef: ElementRef;
    private lazyViewport: LazyViewPort;

    constructor(
        elementRef: ElementRef,
        lazyViewport: LazyViewPort
    ) {
        this.elementRef = elementRef;
        this.lazyViewport = lazyViewport;
        this.offset = 0;
    }

    public ngOnInit(): void {
        if (isNaN( +this.offset )) {
            console.warn(new Error(`[lazyViewportOffset] numst be a number. Currently defined as [${ this.offset }].` ) );
            this.offset = 0;
        }
        this.lazyViewport.setup(this.elementRef.nativeElement, +this.offset);
    }

    public ngOnDestroy(): void {
        this.lazyViewport.teardown();
    }
}
