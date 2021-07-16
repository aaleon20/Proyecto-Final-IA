import { EventEmitter, Injectable } from '@angular/core';
import { FaceApiService } from './face-api.service';
import * as _ from 'lodash';

@Injectable({
  providedIn: 'root'
})
export class VideoPlayerService {
  cbAi: EventEmitter<any> = new EventEmitter<any>();
  constructor(
    private faceApiService: FaceApiService
  ) { 
    

  }

  getLandMark = async (videoElement: any) => {
    const { globalFace, labeledFaceDescriptors } = this.faceApiService;
    const {videoWidth, videoHeight} = videoElement.nativeElement;
    const displaySize = {width: videoWidth, height: videoHeight};

    //--------> ANDRES LEON
    // const results = await globalFace
    // .detectAllFaces()
    // .withFaceLandmarks()
    // .withFaceDescriptors()

    // if (!results.length) {
    //   return
    // }

    // create FaceMatcher with automatically assigned labels
    // from the detection results for the reference image
    //const faceMatcher = new globalFace.FaceMatcher(results)
    ///-------------------------->

    const detectionsFaces = await globalFace.detectAllFaces(videoElement.nativeElement)
      .withFaceLandmarks()
      .withFaceExpressions()
      .withFaceDescriptors();

    // if (event?.isTrusted) {
    //   const img = await globalFace.fetchImage(`../../../assets/labeled/Andres Leon/1.jpg`);
    // }
  

    ///const faceMatcher = new globalFace.FaceMatcher(labeledDescriptors, 0.7);

      if (detectionsFaces.length >= 1) {
      const landmark = detectionsFaces[0].landmarks;
      const expressions = detectionsFaces[0].expressions || null;
      const descriptor = detectionsFaces[0].descriptor;

      const eyeLeft = landmark.getLeftEye();
      const eyeRight = landmark.getRightEye();
      const eyes = {
        left: [_.head(eyeLeft), _.last(eyeLeft)],
        right: [_.head(eyeRight), _.last(eyeRight)],
      };

      const maxDescriptorDistance = 0.6;
      //console.log(labeledFaceDescriptors);

      //match the face descriptors of the detected faces from our input image to our reference data
      const faceMatcher = new globalFace.FaceMatcher(labeledFaceDescriptors, maxDescriptorDistance);

      let bestMatch: any;
      detectionsFaces.forEach((fd: { descriptor: any; }) => {
        bestMatch = faceMatcher.findBestMatch(fd.descriptor)
      })

      const resizedDetections = globalFace.resizeResults(detectionsFaces, displaySize);
      
      this.cbAi.emit({
        resizedDetections,
        bestMatch,
        displaySize,
        expressions,
        eyes,
        videoElement
      });
    }
  }
}
