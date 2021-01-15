import { Injectable } from "@angular/core"
import { Messages } from "../constants/project-messages";
import { CommonDataStorageService } from "./common-datastorage.service";
import { ErrorMessagingService } from "./error-message.service";

@Injectable({
  providedIn: 'root'
})

export class WordProcessor {
  TIMEOUT_DELAY_LARGE10: 10000; // msec
  constructor(private errorService: ErrorMessagingService,
    private common_datastorage: CommonDataStorageService) {

  }
  setTerminologies(terminologies) {
    this.common_datastorage.set('terminologies', terminologies);
  }
  getTerminologies() {
    return this.common_datastorage.get('terminologies');
  }
  toCamelCase(str) {
    return str;
  }

  firstToUpper(str) {
    if (str) {
      if (str.substr(0, 7) === 'http://' || str.substr(0, 8) === 'https://') {
        return str;
      } else {
        return str.charAt(0).toUpperCase() + str.substr(1);
      }
    }
  }
  apiSuccessAutoHide(ob, message) {
    const replaced_message = this.findTerminologyTerm(message);
    ob.api_success = this.firstToUpper(replaced_message);
    setTimeout(() => {
      ob.api_success = null;
    }, this.TIMEOUT_DELAY_LARGE10);
  }
  apiErrorAutoHide(ob, error) {
    error = this.errorService.getApiError(error);
    const replaced_message = this.findTerminologyTerm(error);
    ob.api_error = this.firstToUpper(replaced_message);
    setTimeout(() => {
      ob.api_error = null;
    }, this.TIMEOUT_DELAY_LARGE10);
  }
  getTerminologyTerm(term) {
    const term_only = term.replace(/[\[\]']/g, '').toLowerCase();
    const terminologies = this.common_datastorage.get('terminologies');
    if (terminologies) {
      return (terminologies[term_only]) ? terminologies[term_only] : ((term === term_only) ? term_only : term);
    } else {
      return (term === term_only) ? term_only : term;
    }
  }
  removeTerminologyTerm(term, full_message) {
    const term_replace = this.getTerminologyTerm(term);
    const term_only = term.replace(/[\[\]']/g, ''); // term may me with or without '[' ']'
    return full_message.replace('[' + term_only + ']', term_replace);
  }

  findTerminologyTerm(message) {
    const matches = message.match(/\[(.*?)\]/g);
    let replaced_msg = message;

    if (matches) {
      for (const match of matches) {
        replaced_msg = this.removeTerminologyTerm(match, replaced_msg);
      }
    }
    return replaced_msg;
  }
  getProjectMesssages(key) {
    let message = Messages[key] || '';
    message = this.findTerminologyTerm(message);
    return this.firstToUpper(message);
  }

  getProjectErrorMesssages(error) {
    let message = this.errorService.getApiError(error);
    message = this.findTerminologyTerm(message);
    return this.firstToUpper(message);
  }
}