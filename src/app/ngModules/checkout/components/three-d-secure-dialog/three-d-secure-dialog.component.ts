import { AfterViewInit, Component, ElementRef, Inject, Renderer2 } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
    selector: 'ri-three-d-secure-dialog',
    templateUrl: 'three-d-secure-dialog.component.html',
    styleUrls: ['three-d-secure-dialog.component.scss']
})
export class ThreeDSecureDialogComponent implements AfterViewInit {
    constructor(
        @Inject(MAT_DIALOG_DATA) private iframe: any,
        public dialogRef: MatDialogRef<ThreeDSecureDialogComponent>,
        private renderer2: Renderer2,
        private elementRef: ElementRef) { }

    ngAfterViewInit(): void {
        this.renderer2.appendChild(this.elementRef.nativeElement, this.iframe);
    }
}
