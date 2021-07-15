import { EventEmitter, Injectable } from '@angular/core';
import * as faceapi from 'face-api.js';

@Injectable({
  providedIn: 'root'
})
export class FaceApiService {
  public globalFace:any;
  private modelsForLoad = [
    faceapi.nets.ssdMobilenetv1.loadFromUri('assets/models'),
    faceapi.nets.faceLandmark68Net.loadFromUri('assets/models'),
    faceapi.nets.faceRecognitionNet.loadFromUri('assets/models'),
    faceapi.nets.faceExpressionNet.loadFromUri('assets/models')
  ];
  public labeledFaceDescriptors:any;

  cbModels: EventEmitter<any> = new EventEmitter<any>();

  constructor() { 
    this.globalFace = faceapi;
    this.loadModels();
  }

  loadModels = async () => {
    Promise.all(this.modelsForLoad)
      .then(async res => {
        console.log('Modelos Cargados!!!!!!');
        //const labeledDescriptors = await this.createBbtFaceMatcher(1);
        await this.computeLabeledFaceDescriptor();
        this.cbModels.emit(true);
      })
  }

  async computeLabeledFaceDescriptor() {
    const mtcnnParams = {
      // number of scaled versions of the input image passed through the CNN
      // of the first stage, lower numbers will result in lower inference time,
      // but will also be less accurate
      maxNumScales: 10,
      // scale factor used to calculate the scale steps of the image
      // pyramid used in stage 1
      scaleFactor: 0.709,
      // the score threshold values used to filter the bounding
      // boxes of stage 1, 2 and 3
      scoreThresholds: [0.6, 0.7, 0.7],
      // mininum face size to expect, the higher the faster processing will be,
      // but smaller faces won't be detected
      minFaceSize: 50
    }

    //const options = new faceapi.MtcnnOptions(mtcnnParams);
    const labels = ['Andres Leon','Milagros Leon', 'Shakira'];
    this.labeledFaceDescriptors = await Promise.all(
      labels.map(async label => {
        const imgUrl = `../assets/labeled/${label}/2.jpeg`;
        const img = await faceapi.fetchImage(imgUrl);
        // detect the face with the highest score in the image and compute it's landmarks and face descriptor
        const fullFaceDescription = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor();
        if (!fullFaceDescription) {
          throw new Error(`no faces detected for ${label}`);
        }
        
        const faceDescriptors = [fullFaceDescription.descriptor];
        return new faceapi.LabeledFaceDescriptors(label, faceDescriptors);
      })
    );
  }
}
