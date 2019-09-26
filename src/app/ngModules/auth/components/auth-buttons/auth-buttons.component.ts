import { Component, EventEmitter, Output } from '@angular/core';

@Component({
    selector: 'ri-auth-buttons',
    templateUrl: 'auth-buttons.component.html',
    styleUrls: ['auth-buttons.component.scss']
})

export class AuthButtonsComponent {
    @Output() readonly useEmail: EventEmitter<void> = new EventEmitter<void>();
    @Output() readonly useGoogle: EventEmitter<void> = new EventEmitter<void>();

    onUseEmail(): void {
        this.useEmail.emit();
    }

    onUseGoogle(): void {
        this.useGoogle.emit();
    }
}
