import { Injectable } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';

// Import RxJs required methods

@Injectable()
export class FormMessageDisplayService {

  isFieldValid(form: UntypedFormGroup, field: string) {
    return !form.get(field).valid && form.get(field).touched;
  }

  displayFieldCss(form: UntypedFormGroup, field: string) {
    return {
      'has-error': this.isFieldValid(form, field),
      'has-feedback': this.isFieldValid(form, field)
    };
  }

  validateAllFormFields(formGroup: UntypedFormGroup) {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      if (control instanceof UntypedFormControl) {
        control.markAsTouched({ onlySelf: true });
      } else if (control instanceof UntypedFormGroup) {
        this.validateAllFormFields(control);
      }
    });
  }

  getErrorMessage(form: UntypedFormGroup, field: string, errorMsgs: Object) {
    const error_ob = form.get(field).errors;
    if (error_ob == null) {
      return null;
    }
    const keys = Object.keys(error_ob);
    const errors = keys.map(key => {
      return errorMsgs[key] || '';
    });
    return errors[0];
  }
}
