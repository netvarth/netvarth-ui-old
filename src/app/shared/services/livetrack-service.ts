import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})
/**
 * live track handling service
 */
export class LivetrackService {
    
    LIVETRACK_CONST: {
		"KILOMETER": "km"
	}

    /**
     * 
     * @param key 
     * @returns 
     */
    getUnit(key) {
        if (this.LIVETRACK_CONST[key]) {
            return this.LIVETRACK_CONST[key];
        } else {
            return "";
        }
        
    }

    /**
     * 
     * @param liveTrackInfo 
     * @param businessName 
     * @param mode 
     * @returns 
     */
    getLiveTrackStatusMessage(liveTrackInfo, businessName, mode) {
        if (liveTrackInfo && liveTrackInfo.jaldeeDistanceTime) {
          const distance = liveTrackInfo.jaldeeDistanceTime.jaldeeDistance.distance;
          const unit = this.getUnit(liveTrackInfo.jaldeeDistanceTime.jaldeeDistance.unit);
          const travelTime = liveTrackInfo.jaldeeDistanceTime.jaldeelTravelTime.travelTime;
          const hours = Math.floor(travelTime / 60);
          const minutes = travelTime % 60;
          let message = '';
          if (distance === 0) {
            message += 'You are close to ' + businessName;
          } else {
            message += 'From your current location, you are ' + distance + ' ' + unit + ' away and will take around';
            if (hours !== 0) {
              message += ' ' + hours;
              if (hours === 1) {
                message += ' hr';
              } else {
                message += ' hrs';
              }
            }
            if (minutes !== 0) {
              message += ' ' + minutes;
              if (minutes === 1) {
                message += ' min';
              } else {
                message += ' mins';
              }
            }
            if (mode === 'WALKING') {
              message += ' walk';
            } else if (mode === 'DRIVING') {
              message += ' drive';
            } else if (mode === 'BICYCLING') {
              message += ' ride';
            }
            message += ' to reach ' + businessName;
          }
          return message;
        }
      }
}
