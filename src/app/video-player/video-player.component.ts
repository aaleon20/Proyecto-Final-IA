import { Component, ElementRef, Input, OnInit, ViewChild, Renderer2, OnDestroy } from '@angular/core';
import { Metrica } from '../core/models/metrica.model';
import { FaceApiService } from '../core/services/face-api.service';
import { MetricasService } from '../core/services/metricas.service';
import { VideoPlayerService } from '../core/services/video-player.service';

@Component({
  selector: 'app-video-player',
  templateUrl: './video-player.component.html',
  styleUrls: ['./video-player.component.scss']
})
export class VideoPlayerComponent implements OnInit, OnDestroy {
  @ViewChild('videoElement') videoElement!: ElementRef;
  @Input() stream: any;
  @Input() width!: number;
  @Input() height!: number;
  public modelsReady!: boolean;
  overCanvas: any;
  listEvents: Array<any> = [];

  constructor(
    private renderer2: Renderer2,
    private elementRef: ElementRef,
    private faceApiService: FaceApiService,
    private videoPlayerService: VideoPlayerService,
    private metricaServices: MetricasService
  ) { 
    
  }
  ngOnDestroy(): void {
    this.listEvents.forEach(event => event.unsubscribe());
  }

  ngOnInit(): void {
    this.listenerEvents();
  }

  checkFace = () => {
    setInterval(async () => {
      await this.videoPlayerService.getLandMark(this.videoElement);
    }, 3000);
  };

  listenerEvents = () => {
    const observer1$ = this.faceApiService.cbModels.subscribe(res => {
      this.modelsReady = true;
      this.checkFace();
    });

    const observer2$ = this.videoPlayerService.cbAi
      .subscribe(({resizedDetections, displaySize, expressions, eyes, bestMatch}) => {
        resizedDetections = resizedDetections[0] || null;
        // :TODO Aqui pintamos! dibujamos!
        if (resizedDetections) {
          this.drawFace(resizedDetections, displaySize, eyes, bestMatch, expressions);
        }
      });

    this.listEvents = [observer1$, observer2$]
  };

  drawFace = (resizedDetections: any, displaySize: any, eyes: any, bestMatch: any, expressions: any) => {
    const {globalFace} = this.faceApiService;
    this.overCanvas.getContext('2d').clearRect(0, 0, displaySize.width, displaySize.height);
    globalFace.draw.drawDetections(this.overCanvas, resizedDetections);
    //globalFace.draw.drawFaceLandmarks(this.overCanvas, resizedDetections);
    const minProbability = 0.5;
    globalFace.draw.drawFaceExpressions(this.overCanvas, resizedDetections, minProbability);
    
    const text = [
      bestMatch,
    ]
    const anchor = { x: 200, y: 200 }
    // see DrawTextField below
    const drawOptions = {
      anchorPosition: 'TOP_LEFT',
      backgroundColor: 'rgba(0, 0, 0, 0.5)'
    }
    const drawBox = new globalFace.draw.DrawTextField(text, anchor, drawOptions)
    drawBox.draw(this.overCanvas);
    console.log(expressions);
    let metrica: Metrica = {
      name: bestMatch._label,
      date: new Date(),
      expressions: []
    }
    this.metricaServices.createMetrica(metrica);
  };

  loadedMetaData(){
    this.videoElement.nativeElement.play()
  };

  listenerPlay(){
    const {globalFace} = this.faceApiService;
    this.overCanvas = globalFace.createCanvasFromMedia(this.videoElement.nativeElement);
    this.renderer2.setProperty(this.overCanvas, 'id', 'new-canvas-over');
    this.renderer2.setStyle(this.overCanvas, 'width', `${this.width}px`);
    this.renderer2.setStyle(this.overCanvas, 'height', `${this.height}px`);
    this.renderer2.appendChild(this.elementRef.nativeElement, this.overCanvas);
  };
}
