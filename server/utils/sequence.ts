import { CounterModel } from '~/server/schema/CounterSchema';
import { PortfolioPostsModel } from '~/server/schema/PortfolioPostsSchema'; // Importa il MODELLO Mongoose

export async function getNextSequenceValue(sequenceName: string): Promise<number> {
  // 1. Ottieni il conteggio attuale dei documenti nella collezione PortfolioPosts
  const currentPostCount = await PortfolioPostsModel.countDocuments();

  // 2. Calcola il valore con cui vuoi incrementare la sequenza
  //    Nel tuo esempio, sembra essere (conteggio attuale + 1)
  const incrementBy = currentPostCount + 1;

  const counter = await CounterModel.findByIdAndUpdate(
    sequenceName,
    { $inc: { seq: incrementBy } }, // Incrementa 'seq' del valore calcolato
    { 
      new: true,
      upsert: true
    }
  );
  return counter!.seq; 
}