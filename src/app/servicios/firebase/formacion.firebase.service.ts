import { Injectable } from '@angular/core';
import { Database, ref, get, push, set, remove } from '@angular/fire/database';
import { Formacion } from 'src/app/models/formacion.model';
import { Partido } from 'src/app/models/partido.model';

@Injectable({
  providedIn: 'root'
})
export class FormacionFirebaseService {

  constructor(private db: Database) { }





  
guardarFormacion(formacion: Omit<Formacion, 'id'>): Promise<string> {

     const formacionesRef = ref(this.db, 'formaciones');
      const nuevoRef = push(formacionesRef);
  
      return set(nuevoRef, formacion).then(() => nuevoRef.key!);
}

eliminarFormacion(id: string): Promise<void> {
    const formacionRef = ref(this.db, `formaciones/${id}`);
    return remove(formacionRef)
}



obtenerTodasFormacionesOnce(): Promise<Formacion[]>{

  const formacionesRef = ref(this.db, 'formaciones');

  return get(formacionesRef).then(snapshot => {
    const data = snapshot.val();
      if (!data) return [];
           return Object.entries(data).map(([id, formacion, disposicion]: any) => ({
        disposicion,
        ...formacion
      }));
  });



}

obtenerFormacionPorId(id: string): Promise<Formacion | null> {
  const formacionRef = ref(this.db, `formaciones/${id}`);

  return get(formacionRef).then(snapshot => {
    const data = snapshot.val();
    if (!data) return null;
    return data
  });
}



}


