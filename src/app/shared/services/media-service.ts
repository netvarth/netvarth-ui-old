import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class MediaService {
    getMediaDevices() {
        return new Promise(function (resolve, reject) {
            let media = {};
            navigator.mediaDevices.enumerateDevices().then(devices => {
                let videoDevices = [];
                let audioDevices = [];
                let count = devices.length;
                console.log(count);
                if (count > 0) {
                    console.log(devices);
                    devices.forEach(device => {
                        if (device.kind === 'videoinput') {
                            videoDevices.push(device);
                        } else if (device.kind === 'audioinput') {
                            audioDevices.push(device);
                        }
                        count--;
                        if (count === 0) {
                            media['videoDevices'] = videoDevices;
                            media['audioDevices'] = audioDevices;
                            resolve(media);
                        }
                    });
                } else {
                    reject(media);
                }
            });
        })
    }
}