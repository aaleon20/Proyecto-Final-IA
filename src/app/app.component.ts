import { Component, OnInit } from '@angular/core';
import { MetricasService } from './core/services/metricas.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  public currentStream:any;
  public dimensionVideo: any;
  
  constructor(
    public metricaService:MetricasService
  ){}

  ngOnInit(): void {
    this.checkMediaSource();
    this.getSizeCam();
    
  }

  checkMediaSource = () => {
    if (navigator && navigator.mediaDevices) {

      navigator.mediaDevices.getUserMedia({
        audio: false,
        video: true
      }).then(stream => {
        this.currentStream = stream;
      }).catch(() => {
        console.log('**** ERROR NOT PERMISSIONS *****');
      });

    } else {
      console.log('******* ERROR NOT FOUND MEDIA DEVICES');
    }
  };

  getSizeCam = () => {
    const elementCam: HTMLElement | null = document.querySelector('.cam');
    const {width, height} = elementCam!.getBoundingClientRect();
    this.dimensionVideo = {width, height};
    console.log(this.dimensionVideo);
  }
}
