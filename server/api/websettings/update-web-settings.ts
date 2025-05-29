import { defineEventHandler, readBody } from 'h3'
import { WebSettingsModel } from '../../schema/WebSettingsSchema'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)

    // Trova il primo documento e lo aggiorna
    const updated = await WebSettingsModel.findOneAndUpdate(
      {},             // criterio di ricerca (documento generico)
      { $set: body }, // dati da aggiornare
      { new: true, upsert: true } // crea il documento se non esiste (upsert)
    )

    return {
      success: true,
      data: updated?.toJSON()
    }

  } catch (error) {
    return {
      success: false,
      error: (error as Error).message
    }
  }
})