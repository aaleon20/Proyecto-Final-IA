import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ChartjsModule } from '@ctrl/ngx-chartjs';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { VideoPlayerComponent } from './video-player/video-player.component';
import { PieComponent } from './pie/pie.component';

@NgModule({
  declarations: [
    AppComponent,
    VideoPlayerComponent,
    PieComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ChartjsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
