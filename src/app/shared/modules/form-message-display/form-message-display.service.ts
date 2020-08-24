import { Injectable } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

// Import RxJs required methods

@Injectable()
export class FormMessageDisplayService {

  isFieldValid(form: FormGroup, field: string) {
    return !form.get(field).valid && form.get(field).touched;
  }

  displayFieldCss(form: FormGroup, field: string) {
    return {
      'has-error': this.isFieldValid(form, field),
      'has-feedback': this.isFieldValid(form, field)
    };
  }

  validateAllFormFields(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      if (control instanceof FormControl) {
        control.markAsTouched({ onlySelf: true });
      } else if (control instanceof FormGroup) {
        this.validateAllFormFields(control);
      }
    });
  }

  getErrorMessage(form: FormGroup, field: string, errorMsgs: Object) {
    const error_ob = form.get(field).errors;
    if (error_ob == null) {
      return null;
    }
    const keys = Object.keys(error_ob);
    const errors = keys.map(key => {
      return errorMsgs[key] || 'Validation Error';
    });
    return errors[0];
  }
}
