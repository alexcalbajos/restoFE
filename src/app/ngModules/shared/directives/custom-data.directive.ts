import { Directive, ElementRef, Input, OnInit, Renderer2 } from '@angular/core';

@Directive({ selector: '[ri-custom-data]' })
export class CustomDataDirective implements OnInit {
    @Input() data: any;

    constructor(private renderer: Renderer2, private hostElement: ElementRef) { }

    ngOnInit(): void {
        this.renderer.setAttribute(this.hostElement.nativeElement, 'data', this.data);
    }
}
