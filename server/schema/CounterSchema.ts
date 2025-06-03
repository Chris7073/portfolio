// server/schema/CounterSchema.ts
import { Schema, model, Document } from 'mongoose';

export interface ICounter extends Document {
  _id: string; // Questo sarà il nome della tua sequenza, es. 'post_id_counter'
  seq: number; // Questo è l'ultimo valore della sequenza generato
}

const CounterSchema = new Schema<ICounter>({
  _id: { type: String, required: true },
  seq: { type: Number, default: 0 }
});

// Assicurati che il nome del modello sia univoco se ne hai altri
export const CounterModel = model<ICounter>('Counter', CounterSchema);