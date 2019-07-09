import { OnInit, OnDestroy, Directive, Renderer2, ElementRef } from '@angular/core';
import { LazyTarget, LazyViewPort } from './lazytarget';

@Directive({
    selector: '[lazySrc]',
    // tslint:disable-next-line:use-input-property-decorator
    inputs: [
        'src: lazySrc',
        'visibleClass: lazySrcVisible'
    ]
})

export class LazySrcDirective implements OnInit, OnDestroy, LazyTarget {

    public element: Element;
    public src: string;
    public visibleClass: string;

    private lazyViewport: LazyViewPort;
    private renderer: Renderer2;

    constructor(
        elementRef: ElementRef,
        lazyViewport: LazyViewPort,
        renderer: Renderer2
    ) {
        this.element = elementRef.nativeElement;
        this.lazyViewport = lazyViewport;
        this.renderer = renderer;

        this.src = '';
        this.visibleClass = '';
    }

    public ngOnDestroy(): void {
       // tslint:disable-next-line:no-unused-expression
       (this.lazyViewport) && this.lazyViewport.removeTarget(this);
    }

    public ngOnInit(): void {
        this.lazyViewport.addTarget(this);
    }
    public updateVisibility(isVisible: boolean, ratio: number): void {
        if (!isVisible) {
            return;
        }

        this.lazyViewport.removeTarget(this);
        this.lazyViewport = null;
        this.renderer.setProperty(this.element, 'src', this.src);

        // tslint:disable-next-line:no-unused-expression
        (this.visibleClass) && this.renderer.addClass(this.element, this.visibleClass);
    }
}
