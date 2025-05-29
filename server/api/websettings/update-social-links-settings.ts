import { socialLinksModel,TSocialSettings } from '../../schema/SocialLinksSettingsSchema'

export default defineEventHandler(async (event) => {
  try {
    const body:TSocialSettings[] = await readBody(event)

    // Trova il primo documento e lo aggiorna
/*     const updated = await socialLinksModel.findOneAndUpdate(
      {},             // criterio di ricerca (documento generico)
      { $set: body }, // dati da aggiornare
      { new: true, upsert: true } // crea il documento se non esiste (upsert)
    ) */
      // STEP 1: elimina i link non presenti nel nuovo array
    const incomingIds = body.map(item => item.id)
    await socialLinksModel.deleteMany({ id: { $nin: incomingIds } })
    
   const operations = body.map(item => ({
      updateOne: {
        filter: { id: item.id },
        update: { $set: item },
        upsert: true
      }
    }))
    const result = await socialLinksModel.bulkWrite(operations)

    return {
      success: true,
      message: 'Social links aggiornati',
      result
    }

  } catch (error) {
    return {
      success: false,
      error: (error as Error).message
    }
  }
})