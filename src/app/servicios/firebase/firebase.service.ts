import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import {
  Database,
  ref,
  set,
  get,
  update,
  off,
  remove,
  push,
  onValue,
} from '@angular/fire/database';

@Injectable({
  providedIn: 'root',
})
export class FirebaseService {
  private db: Database;

  constructor() {
    this.db = inject(Database);
  }
}