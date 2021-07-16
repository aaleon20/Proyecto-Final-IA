import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { debounceTime, delay, map, switchMap, tap } from 'rxjs/operators';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { Metrica } from '../models/metrica.model';

import { State } from '../models/state.model';

const COLLECTION_NAME = 'metrica';

@Injectable({
  providedIn: 'root'
})
export class MetricasService {
  private _loading$ = new BehaviorSubject<boolean>(true);
  private _search$ = new Subject<void>();
  private _metricas$ = new BehaviorSubject<Metrica[]>([]);
  private _total$ = new BehaviorSubject<number>(0);
  private _pages$ = new BehaviorSubject<number[]>([]);
  private _state:State = {
    page: 1,
    pageSize: 15,
    searchTerm: '',
    sortColumn: 'name',
    sortDirection: ''
  }
  constructor(
    private afStore:AngularFirestore,
  ) { 
    this._search$
    .pipe(
      tap(() => this._loading$.next(true)),
      debounceTime(200),
      switchMap(() => this._search()),
      delay(0),
      tap(() => this._loading$.next(false))
    ).subscribe(result => {
      this._metricas$.next(result)
    })

    this._search$.next();
  }

  createMetrica(metrica: Metrica){
    return this.afStore.collection(COLLECTION_NAME).add(metrica);
  }

  get metricas$() { return this._metricas$.asObservable(); }

  getMetricas(): Observable<Metrica[]>{
    return this.afStore.collection(COLLECTION_NAME, ref => ref.orderBy('date', 'desc').limit(10)).snapshotChanges()
    .pipe(
      map((metricas) =>
        metricas.map((metrica) => {
          return {
            uid:metrica.payload.doc.id,
          }
        })
      ),
    );
  }

  _search(): Observable<Metrica[]> {
    const {sortColumn, sortDirection, pageSize, page, searchTerm} = this._state;

    let metricas: Observable<Metrica[]> = this.getMetricas();
    return metricas;
  }

}
