import { Component, OnInit } from '@angular/core';
import { ChartData, ChartOptions } from 'chart.js';
import {
  ArcElement,
  BarController,
  BarElement,
  CategoryScale,
  Chart,
  DoughnutController,
  LinearScale,
  LineController,
  LineElement,
  PieController,
  PointElement,
  PolarAreaController,
  RadarController,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

@Component({
  selector: 'app-pie',
  templateUrl: './pie.component.html',
  styleUrls: ['./pie.component.scss']
})
export class PieComponent implements OnInit {
  data: ChartData = {
    labels: ['Neutral', 'Feliz', 'Triste', 'Enojado', 'Temeroso', 'Disgustado', 'Sorprendido'],
    datasets: [
      {
        data: [300, 50, 100, 300, 10, 60, 90],
        backgroundColor: ['#39ACA8', '#78B83D', '#AECF6E', '#CFB86E', '#BADEE8', '#BAE3AB', '#94DBD5'],
        hoverBackgroundColor: ['#39ACA8', '#78B83D', '#AECF6E', '#CFB86E', '#BADEE8', '#BAE3AB', '#94DBD5'],
      },
    ],
  };

  options: ChartOptions = {
    responsive: false,
  };
  constructor() { }

  ngOnInit(): void {
    Chart.register(
      ArcElement,
      BarController,
      BarElement,
      CategoryScale,
      DoughnutController,
      LinearScale,
      LineController,
      LineElement,
      PieController,
      PointElement,
      PolarAreaController,
      RadarController,
      RadialLinearScale,
      Title,
      Tooltip,
      Legend,
    );
  }

}
