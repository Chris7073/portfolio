import { defineEventHandler, readBody } from 'h3'
import { PortfolioPostsModel } from '../../../../schema/PortfolioPostsSchema' // Assicurati che il percorso sia corretto

export default defineEventHandler(async (event) => {
  try {
    // 1. ESTRAI L'ID DALL'URL
    // Il nome 'post_id' deve corrispondere al nome della cartella [post_id]
    const idDaAggiornare = event.context.params?.pid

    if (!idDaAggiornare) {
      // Se per qualche motivo l'ID non è nell'URL, restituisci un errore chiaro
      return { success: false, error: `ID del post mancante nella richiesta.${idDaAggiornare}` }
    }

    const body = await readBody(event)

    // 2. USA L'ID NELLA QUERY DI RICERCA
    // Trova il documento dove il campo 'post_id' corrisponde a quello ricevuto
    const updated = await PortfolioPostsModel.findOneAndUpdate(
      { post_id: idDaAggiornare },  // <-- MODIFICA CRUCIALE: questo è il filtro!
      { $set: body },               // Dati con cui aggiornare
      { new: true }                 // Opzione: restituisce il documento dopo l'aggiornamento
    )

    // 3. GESTISCI IL CASO IN CUI IL DOCUMENTO NON ESISTE
    if (!updated) {
      // Se `findOneAndUpdate` non trova un documento con quell'ID, restituisce `null`.
      // Questo ora è un errore gestito, perché l'endpoint è per l'UPDATE, non per la creazione.
      return { success: false, error: `Nessun progetto trovato con post_id: ${idDaAggiornare}` }
    }

    // Se tutto va bene, restituisci successo con i dati aggiornati
    return {
      success: true,
      data: updated.toJSON()
    }

  } catch (error) {
    // Questo gestisce errori del database o altri problemi imprevisti
    return {
      success: false,
      error: (error as Error).message
    }
  }
})