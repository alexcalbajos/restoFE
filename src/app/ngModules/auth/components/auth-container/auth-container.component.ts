import { Component, EventEmitter, Output } from '@angular/core';

@Component({
    selector: 'ri-auth-container',
    templateUrl: 'auth-container.component.html',
    styleUrls: ['auth-container.component.scss']
})

export class AuthContainerComponent {
    title: string = 'LOG_IN_SIGN_UP';
    state: number = 2;
    initialEmailVisible: number = 2;
    googleLoginVisible: number = 3;
    loginVisible: number = 4;
    registerVisible: number = 5;
    email: string;
    @Output() readonly clientAuthenticated: EventEmitter<void> = new EventEmitter<void>();

    validEmail(email: string): void {
        this.changeState(this.loginVisible);
        this.email = email;
    }

    newEmail(email: string): void {
        this.changeState(this.registerVisible);
        this.email = email;
    }

    emailChanged(email: string): void {
        this.changeState(this.initialEmailVisible);
        this.email = email;
    }

    changeState(newState: number): void {
        switch (newState) {
            case this.loginVisible:
                this.title = 'LOG_IN';
                break;
            case this.registerVisible:
                this.title = 'CREATE_ACCOUNT';
                break;
            default:
                this.title = 'LOG_IN_SIGN_UP';
                break;
        }

        this.state = newState;
    }

    onClientAuthention(): void {
        this.clientAuthenticated.emit();
    }
}
