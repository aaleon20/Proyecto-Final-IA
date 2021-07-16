import { DatePipe } from '@angular/common';
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
    private metricaServices: MetricasService,
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
    const anchor = { x: 260, y: 10 }
    // see DrawTextField below
    const drawOptions = {
      anchorPosition: 'TOP_LEFT',
      backgroundColor: 'rgba(0, 0, 0, 0.5)'
    }
    const drawBox = new globalFace.draw.DrawTextField(text, anchor, drawOptions)
    drawBox.draw(this.overCanvas);
    this.obtenerExpresionMayor(expressions);
    var date = new Date();


    let metrica: Metrica = {
      name: bestMatch._label,
      date: `${date.getDate()}/${0}${date.getMonth()}/${date.getFullYear()}`,
      hour: `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`,
      date_create: new Date,
      expression: this.obtenerExpresionMayor(expressions)
    }
    this.metricaServices.createMetrica(metrica);
  };

  obtenerExpresionMayor(expressions: any){
    let expression = 'Neutral';
    if (expressions.neutral > expressions.surprised && 
        expressions.neutral > expressions.disgusted &&
        expressions.neutral > expressions.fearful &&
        expressions.neutral > expressions.sad &&
        expressions.neutral > expressions.angry &&
        expressions.neutral > expressions.happy) {
          expression = 'Neutral';
    }
    if (expressions.surprised > expressions.neutral && 
      expressions.surprised > expressions.disgusted &&
      expressions.surprised > expressions.fearful &&
      expressions.surprised > expressions.sad &&
      expressions.surprised > expressions.angry &&
      expressions.surprised > expressions.happy) {
        expression = 'Surprised';
    }
    if (expressions.disgusted > expressions.neutral && 
      expressions.disgusted > expressions.surprised &&
      expressions.disgusted > expressions.fearful &&
      expressions.disgusted > expressions.sad &&
      expressions.disgusted > expressions.angry &&
      expressions.disgusted > expressions.happy) {
        expression = 'Disgusted';
    }
    if (expressions.fearful > expressions.neutral && 
      expressions.fearful > expressions.disgusted &&
      expressions.fearful > expressions.surprised &&
      expressions.fearful > expressions.sad &&
      expressions.fearful > expressions.angry &&
      expressions.fearful > expressions.happy) {
        expression = 'Fearful';
    }
    if (expressions.sad > expressions.neutral && 
      expressions.sad > expressions.disgusted &&
      expressions.sad > expressions.surprised &&
      expressions.sad > expressions.fearful &&
      expressions.sad > expressions.angry &&
      expressions.sad > expressions.happy) {
        expression = 'Sad';
    }
    if (expressions.angry > expressions.neutral && 
      expressions.angry > expressions.disgusted &&
      expressions.angry > expressions.surprised &&
      expressions.angry > expressions.fearful &&
      expressions.angry > expressions.sad &&
      expressions.angry > expressions.happy) {
        expression = 'Angry';
    }
    if (expressions.happy > expressions.neutral && 
      expressions.happy > expressions.disgusted &&
      expressions.happy > expressions.surprised &&
      expressions.happy > expressions.fearful &&
      expressions.happy > expressions.sad &&
      expressions.happy > expressions.angry) {
        expression = 'Happy';
    }
    return expression;
  }

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
