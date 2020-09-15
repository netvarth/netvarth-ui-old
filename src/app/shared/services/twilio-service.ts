import { Injectable, ElementRef, Renderer2, RendererFactory2 } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
// import { HttpClient } from '@angular/common/http';
// import { Router } from '@angular/router';
import * as twilio from 'twilio-video';
@Injectable()
export class TwilioService {
    remoteVideo: ElementRef;
    localVideo: ElementRef;
    previewing: boolean;
    msgSubject = new BehaviorSubject('');
    roomObj: any;
    microphone = true;
    roomParticipants;
    private renderer: Renderer2;
    constructor(
        // private httpClient: HttpClient,
        // private router: Router,
        public rendererFactory: RendererFactory2) {
        this.renderer = rendererFactory.createRenderer(null, null);
    }
    getToken(username): Observable<any> {
        return new Observable();
        // return this.httpClient.post('/abc', { uid: 'ashish' });
    }

    mute() {
        this.roomObj.localParticipant.audioTracks.forEach(function (
            audioTrack
        ) {
            audioTrack.track.disable();
        });
        this.microphone = false;
    }
    unmute() {
        this.roomObj.localParticipant.audioTracks.forEach(function (
            audioTrack
        ) {
            audioTrack.track.enable();
        });
        this.microphone = true;
    }
    // connectToRoom(accessToken, options): void {
        // twilio.connect(accessToken, {
        //     audio: true,
        //     name: 'Manis-room',
        //     video: { width: 640 }
        // }).then(room => {
        //     console.log('Connected to Room: ' + room.name);
        //     console.log('Successfully joined a Room:' + room);
        //     room.on('participantConnected', participant => {
        //         console.log('A remote Participant connected:' + participant);
        //     });


        //     // Log your Client's LocalParticipant in the Room
        //     const localParticipant = room.localParticipant;
        //     console.log(localParticipant.identity);
        //     console.log('Connected to the Room as LocalParticipant "' + localParticipant.identity + '"');

        //     // Log any Participants already connected to the Room
        //     room.participants.forEach(participant => {
        //         console.log('Participant "' + participant.identity + '" is connected to the Room');
        //     });

        //     // Log new Participants as they connect to the Room
        //     room.once('participantConnected', participant => {
        //         console.log('Participant "' + participant.identity + '" has connected to the Room');
        //     });

        //     // Log Participants as they disconnect from the Room
        //     room.once('participantDisconnected', participant => {
        //         console.log('Participant "' + participant.identity + '" has disconnected from the Room');
        //     });

        //     // Attach the Participant's Media to a <div> element.
        //     room.on('participantConnected', participant => {
        //         console.log('Participant "' + participant.identity + '" connected');

        //         participant.tracks.forEach(publication => {
        //             if (publication.isSubscribed) {
        //                 const track = publication.track;
        //                 this.renderer.appendChild(this.remoteVideo.nativeElement, track.attach());
        //             }
        //         });

        //         participant.on('trackSubscribed', track => {
        //             this.renderer.appendChild(this.remoteVideo.nativeElement, track.attach());
        //         });
        //     });

        //     room.participants.forEach(participant => {
        //         participant.tracks.forEach(publication => {
        //             if (publication.track) {
        //                 this.renderer.appendChild(this.remoteVideo.nativeElement, publication.track);
        //                 // document.getElementById('remote-media-div').appendChild(publication.track.attach());
        //             }
        //         });
        //         participant.on('trackSubscribed', track => {
        //             this.renderer.appendChild(this.remoteVideo.nativeElement, track.attach());
        //             // document.getElementById('remote-media-div').appendChild(track.attach());
        //         });
        //     });
        //     room.localParticipant.audioTracks.forEach(publication => {
        //         publication.track.disable();
        //     });

        //     // room.localParticipant.videoTracks.forEach(publication => {
        //     //     publication.track.disable();
        //     // });
        //     // room.localParticipant.videoTracks.forEach(publication => {
        //     //     publication.track.stop();
        //     //     publication.unpublish();
        //     // });
        //     function handleTrackDisabled(track) {
        //         track.on('disabled', () => {
        //             /* Hide the associated <video> element and show an avatar image. */
        //         });
        //     }

        //     room.participants.forEach(participant => {
        //         participant.tracks.forEach(publication => {
        //             if (publication.isSubscribed) {
        //                 handleTrackDisabled(publication.track);
        //             }
        //             publication.on('subscribed', handleTrackDisabled);
        //         });
        //     });
        //     room.participants.forEach(participant => {
        //         participant.tracks.forEach(publication => {
        //             publication.on('unsubscribed', () => {
        //                 /* Hide the associated <video> element and show an avatar image. */
        //             });
        //         });
        //     });
        //     room.localParticipant.audioTracks.forEach(publication => {
        //         publication.track.enable();
        //     });

        //     room.localParticipant.videoTracks.forEach(publication => {
        //         publication.track.enable();
        //     });
        //     twilio.createLocalVideoTrack().then(localVideoTrack => {
        //         return room.localParticipant.publishTrack(localVideoTrack);
        //     }).then(publication => {
        //         console.log('Successfully unmuted your video:', publication);
        //     });
        //     twilio.createLocalVideoTrack().then(track => {
        //         // const localMediaContainer = document.getElementById('local-media');
        //         this.renderer.appendChild(this.localVideo.nativeElement, track.attach());
        //         // localMediaContainer.appendChild(track.attach());
        //     });
        //     room.on('disconnected', room1 => {
        //         // Detach the local media elements
        //         room1.localParticipant.tracks.forEach(publication => {
        //             const attachedElements = publication.track.detach();
        //             attachedElements.forEach(element => element.remove());
        //         });
        //     });

        //     // To disconnect from a Room
        //     room.disconnect();
        // }, error => {
        //     console.error('Unable to connect to Room: ' + error.message);
        // });

        // twilio.connect(accessToken, { name: 'existing-room' }).then(room => {
        //     console.log('Successfully joined a Room: ${room}');
        //     room.on('participantConnected', participant => {
        //     console.log('A remote Participant connected: ${participant}');
        //     });
        // }, error => {
        //     console.error('Unable to connect to Room: ${error.message}');
        // });
    // }
    connectToRoom(accessToken, options): void {
        twilio.connect(accessToken, options).then(room => {
            this.roomObj = room;
            console.log('Connected to Room: ' + room.name);
            console.log('Successfully joined a Room:' + room);
            if (!this.previewing && options['video']) {
                this.startLocalVideo();
                this.previewing = true;
            }
            this.roomParticipants = room.participants;
            room.participants.forEach(participant => {
                console.log('Participant # ' + participant);
                this.attachParticipantTracks(participant);
            });
            room.on('participantDisconnected', (participant) => {
                console.log('participantDisconnected');
                this.detachTracks(participant);
            });
            room.on('participantConnected', (participant) => {
                console.log('Participant connected Event');
                this.roomParticipants = room.participants;
                this.attachParticipantTracks(participant);
                participant.on('trackPublished', track => {
                    const element = track.attach();
                    this.renderer.data.id = track.sid;
                    this.renderer.setStyle(element, 'height', '100%');
                    this.renderer.setStyle(element, 'max-width', '100%');
                    this.renderer.appendChild(this.remoteVideo.nativeElement, element);
                });
            });
            // When a Participant adds a Track, attach it to the DOM.
            room.on('trackPublished', (track, participant) => {
                console.log('Track Published');
                this.attachTracks([track]);
            });
            // When a Participant removes a Track, detach it from the DOM.
            room.on('trackRemoved', (track, participant) => {
                console.log('Track Removed');
                this.detachTracks([track]);
            });
            room.once('disconnected', (room1) => {
                console.log('Disconnected');
                room1.localParticipant.tracks.forEach(track => {
                    track.track.stop();
                    const attachedElements = track.track.detach();
                    attachedElements.forEach(attachelement => attachelement.remove());
                    room1.localParticipant.videoTracks.forEach(video => {
                        const trackConst = [video][0].track;
                        trackConst.stop(); // <- error
                        trackConst.detach().forEach(trackelement => trackelement.remove());
                        room1.localParticipant.unpublishTrack(trackConst);
                    });
                    const element = this.remoteVideo.nativeElement;
                    while (element.firstChild) {
                        element.removeChild(element.firstChild);
                    }
                    const localElement = this.localVideo.nativeElement;
                    while (localElement.firstChild) {
                        localElement.removeChild(localElement.firstChild);
                    }
                    // this.router.navigate(['thanks']);
                });
            });
        }, (error) => {
            console.log(error);
            alert(error.message);
        });
    }
    attachParticipantTracks(participant): void {
        console.log('Attaching participants');
        participant.tracks.forEach(part => {
            this.trackPublished(part);
        });
    }
    trackPublished(publication) {
        console.log('Track Published');
        if (publication.isSubscribed) {
            this.attachTracks(publication.track);
        }
        if (!publication.isSubscribed) {
            publication.on('subscribed', track => {
                this.attachTracks(track);
            });
        }
    }
    attachTracks(tracks) {
        const element = tracks.attach();
        this.renderer.data.id = tracks.sid;
        this.renderer.setStyle(element, 'height', '100%');
        this.renderer.setStyle(element, 'max-width', '100%');
        console.log(this.localVideo);
        console.log(this.remoteVideo);
        console.log('Attach Tracks');
        this.renderer.appendChild(this.remoteVideo.nativeElement, element);
    }
    startLocalVideo(): void {
        console.log('Start Local Video');
        this.roomObj.localParticipant.videoTracks.forEach(publication => {
            const element = publication.track.attach();
            this.renderer.data.id = publication.track.sid;
            this.renderer.setStyle(element, 'width', '25%');
            console.log(this.localVideo);
            console.log(this.remoteVideo);
            this.renderer.appendChild(this.localVideo.nativeElement, element);
        });
    }
    detachTracks(tracks): void {
        console.log('Detach Tracks');
        tracks.tracks.forEach(track => {
            const element = this.remoteVideo.nativeElement;
            while (element.firstChild) {
                element.removeChild(element.firstChild);
            }
        });
    }
}
