import { Injectable } from "@angular/core"
import { Messages } from "../constants/project-messages";
import { CommonDataStorageService } from "./common-datastorage.service";
import { ErrorMessagingService } from "./error-message.service";

@Injectable({
  providedIn: 'root'
})
/**
 * Terminology/Word Factory
 */
export class WordProcessor {
  TIMEOUT_DELAY_LARGE10= 10000; // msec
  constructor(private errorService: ErrorMessagingService,
    private common_datastorage: CommonDataStorageService) {

  }
  /**
   * Method to set the terminlogies for Jaldee
   * @param terminologies 
   */
  setTerminologies(terminologies) {
    this.common_datastorage.set('terminologies', terminologies);
  }
  /**
   * Method to get the terminologies
   */
  getTerminologies() {
    return this.common_datastorage.get('terminologies');
  }
  /**
   * Method returns the CamelCase
   * @param str text to convert
   */
  toCamelCase(str) {
    return str;
  }

  /**
   * Convert the first letter to Uppercase
   * @param str 
   */
  firstToUpper(str) {
    if (str) {
      if (str.substr(0, 7) === 'http://' || str.substr(0, 8) === 'https://') {
        return str;
      } else {
        return str.charAt(0).toUpperCase() + str.substr(1);
      }
    }
  }
  /**
   * Show/Hide Success or Error Messages
   * @param ob Object to put the message
   * @param message Message to show
   */
  apiSuccessAutoHide(ob, message) {
    const replaced_message = this.findTerminologyTerm(message);
    ob.api_success = this.firstToUpper(replaced_message);
    setTimeout(() => {
      ob.api_success = null;
    }, this.TIMEOUT_DELAY_LARGE10);
  }
  /**
   * Show error and hide it automatically
   * @param ob Object holds the message
   * @param error Message to be shown
   */
  apiErrorAutoHide(ob, error) {
    error = this.errorService.getApiError(error);
    const replaced_message = this.findTerminologyTerm(error);
    ob.api_error = this.firstToUpper(replaced_message);
    setTimeout(() => {
      ob.api_error = null;
    }, this.TIMEOUT_DELAY_LARGE10);
  }
  /**
   * Get the terminology from terminologies
   * @param term 
   */
  getTerminologyTerm(term) {
    const term_only = term.replace(/[\[\]']/g, '').toLowerCase();
    const terminologies = this.common_datastorage.get('terminologies');
    if (terminologies) {
      return (terminologies[term_only]) ? terminologies[term_only] : ((term === term_only) ? term_only : term);
    } else {
      return (term === term_only) ? term_only : term;
    }
  }
  /**
   * Replace the term within the full message
   * @param term term to be replaced
   * @param full_message full message
   */
  removeTerminologyTerm(term, full_message) {
    const term_replace = this.getTerminologyTerm(term);
    const term_only = term.replace(/[\[\]']/g, ''); // term may me with or without '[' ']'
    return full_message.replace('[' + term_only + ']', term_replace);
  }
/**
 * Find the terminology
 * @param message 
 */
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
  /**
   * get the message from the messages list
   * @param key identifier for the message
   */
  getProjectMesssages(key) {
    let message = Messages[key] || '';
    message = this.findTerminologyTerm(message);
    return this.firstToUpper(message);
  }
/**
 * Extract error message from the error object
 * @param error error message to shown
 */
  getProjectErrorMesssages(error) {
    let message = this.errorService.getApiError(error);
    message = this.findTerminologyTerm(message);
    return this.firstToUpper(message);
  }
}