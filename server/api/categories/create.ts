// Il tuo file API per la creazione, es. server/api/projects/create.post.ts
import { PortfolioCatsModel, TPortfolioCats } from "~/server/schema/PortfolioCategoriesSchema";
import { getNextSequenceValue } from "~/server/utils/sequence"; // Importa la funzione

export default defineEventHandler(async event => {
    const userSession = await requireUserSession(event); // Rinominato per chiarezza

    const bodyData = await readBody<Pick<TPortfolioCats, "cat_name"|"cat_desc">>(event);

    if (!bodyData || !bodyData.cat_name || bodyData.cat_name.trim() === '') {
        throw createError({
            statusCode: 400,
            statusMessage: 'Bad Request: cat_name is required and cannot be empty.',
        });
    }

    // Genera il prossimo post_id univoco
    const nextPostId = await getNextSequenceValue('portfolio_cat_id_counter'); // Scegli un nome per la tua sequenza

    const newCatData: Partial<TPortfolioCats> = {
        cat_id: nextPostId.toString(), // Imposta il post_id generato
        cat_name: `#`+bodyData.cat_name,
        cat_desc:bodyData.cat_desc,
        // user_id: userSession.user?.id, // Esempio: associa l'utente loggato
        // post_active: true, // Esempio: imposta un valore di default
    };

    if (bodyData.cat_desc && bodyData.cat_desc.trim() !== '') {
        newCatData.cat_desc = bodyData.cat_desc.trim();
    }

    try {
        const project = await PortfolioCatsModel.create(newCatData);
        return project.toJSON() as TPortfolioCats; // toJSON() è utile per pulire l'output di Mongoose
    } catch (error: any) {
        // Gestione errori, es. se l'indice unique su post_id fallisce (improbabile con i contatori, ma buona pratica)
        if (error.code === 11000) { // Codice errore MongoDB per duplicazione chiave
             throw createError({
                statusCode: 409, // Conflict
                statusMessage: 'Conflict: A project with this generated ID already exists. Please try again.',
                // Potresti voler ritentare la generazione dell'ID qui, ma con i contatori è raro.
            });
        }
        console.error("Error creating project:", error);
        throw createError({
            statusCode: 500,
            statusMessage: 'Internal Server Error: Could not create the project.',
        });
    }
});