// Il tuo file API per la creazione, es. server/api/projects/create.post.ts
import { PortfolioPostsModel, TPortfolioPosts } from "~/server/schema/PortfolioPostsSchema";
import { getNextSequenceValue } from "~/server/utils/sequence"; // Importa la funzione

export default defineEventHandler(async event => {
    const userSession = await requireUserSession(event); // Rinominato per chiarezza

    const bodyData = await readBody<Pick<TPortfolioPosts, "post_name" | "post_desc"|"post_cat"|"post_active">>(event);

    if (!bodyData || !bodyData.post_name || bodyData.post_name.trim() === '') {
        throw createError({
            statusCode: 400,
            statusMessage: 'Bad Request: post_name is required and cannot be empty.',
        });
    }

    // Genera il prossimo post_id univoco
    const nextPostId = await getNextSequenceValue('portfolio_post_id_counter'); // Scegli un nome per la tua sequenza

    const newProjectData: Partial<TPortfolioPosts> = {
        post_id: nextPostId, // Imposta il post_id generato
        post_name: bodyData.post_name.trim(),
        post_cat:bodyData.post_cat,
        post_active:bodyData.post_active,
        // user_id: userSession.user?.id, // Esempio: associa l'utente loggato
        // post_active: true, // Esempio: imposta un valore di default
    };

    if (bodyData.post_desc && bodyData.post_desc.trim() !== '') {
        newProjectData.post_desc = bodyData.post_desc.trim();
    }

    try {
        const project = await PortfolioPostsModel.create(newProjectData);
        return project.toJSON() as TPortfolioPosts; // toJSON() è utile per pulire l'output di Mongoose
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