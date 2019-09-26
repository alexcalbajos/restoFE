import { Injectable } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';

import { ScrollService } from './scroll.service';

@Injectable()
export class FormValidationService {
    constructor(private scrollService: ScrollService) { }

    isFormControlInvalid(formControl: AbstractControl): boolean {
        return formControl.invalid &&
            formControl.dirty;
    }

    displayError(formControl: AbstractControl, errorKey: string): boolean {
        return formControl.errors &&
            formControl.errors[errorKey] &&
            formControl.dirty;
    }

    validateForm(formGroup: FormGroup, offsetForFirstInvalidField?: number, container?: string): void {
        Object.keys(formGroup.controls).forEach((field: string) => {
            const control: AbstractControl = formGroup.get(field);
            control.markAsDirty({ onlySelf: true });
        });

        this.scrollToFirstInvalidField(formGroup, offsetForFirstInvalidField, container);
    }

    setCustomErrors(formGroup: FormGroup, errors: any, useCodes: boolean = false): FormGroup {
        errors.forEach((error: any) => {
            if (formGroup.controls[error.property]) {
                if (useCodes) {
                    formGroup.controls[error.property].setErrors({ custom: `ERR_${error.code}` });
                } else {
                    formGroup.controls[error.property].setErrors({ custom: error.message });
                }
            }
        });

        return formGroup;
    }

    private scrollToFirstInvalidField(formGroup: FormGroup, offset?: number, container?: string): void {
        if (!formGroup.valid) {
            let target: string;

            Object.keys(formGroup.controls).forEach((field: string) => {
                const control: AbstractControl = formGroup.get(field);
                if (!control.valid && !target) {
                    target = field;
                }
            });

            this.scrollService.scrollTo(`[formcontrolname='${target}']`, container, offset);
        }
    }
}
