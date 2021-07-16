import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ChartjsModule } from '@ctrl/ngx-chartjs';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { VideoPlayerComponent } from './video-player/video-player.component';
import { PieComponent } from './pie/pie.component';
import { AngularFireModule } from '@angular/fire';
import { environment } from 'src/environments/environment';
import { AngularFirestoreModule } from '@angular/fire/firestore';

@NgModule({
  declarations: [
    AppComponent,
    VideoPlayerComponent,
    PieComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ChartjsModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFirestoreModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
