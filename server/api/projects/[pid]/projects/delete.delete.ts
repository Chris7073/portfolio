import { PostBlockModel } from '../../../../schema/PostBlockSchema';
import { PortfolioPostsModel } from '../../../../schema/PortfolioPostsSchema';

export default defineEventHandler(async event => {
    // const ctx = await requireUserSession(event); // Ricorda la sicurezza!

    const pidString = event.context.params?.pid;

    // 1. Validazione dell'input essenziale (ID)
    // Un ID mancante o non valido è un errore del client, quindi un 400 è appropriato.
    if (!pidString) {
        console.warn('SERVER: Missing pid parameter from URL.');
        throw createError({ statusCode: 400, message: 'Missing project ID parameter' });
    }

    const pidAsNumber = parseInt(pidString, 10);
    if (isNaN(pidAsNumber)) {
        console.warn(`SERVER: Invalid pid parameter. '${pidString}' is not a valid number.`);
        throw createError({ statusCode: 400, message: 'Invalid project ID parameter: must be a numeric value.' });
    }

    // 2. [OPZIONALE] Gestione del corpo della richiesta (`project`)
    // Il tuo codice precedente includeva la lettura di `project` dal corpo.
    // Se per cancellare ti basta solo il `pidAsNumber` dall'URL, puoi rimuovere questa parte.
    // Se `project` nel corpo è ancora necessario per qualche logica o validazione, mantienilo.
    // Qui lo lascio, ma se non serve, eliminalo pure.
    const { project } = await readBody(event);
    if (project === undefined) { // O un controllo più specifico se 'project' deve avere una certa struttura
        console.warn('SERVER: "project" data is missing in the request body.');
        throw createError({ status: 400, message: 'Project data is required in body' });
    }
    // Fine parte opzionale per `project` nel corpo.

    try {
        console.log(`SERVER: "AMEN" Deletion - Attempting deletions for post_id: ${pidAsNumber}`);

        // Tentativo di cancellazione da PortfolioPostsModel
        // "se esistono li cancella altrimenti AMEN"
        const portfolioDeleteResult = await PortfolioPostsModel.deleteOne({ post_id: pidAsNumber });
        // Log opzionale, puoi rimuoverlo se vuoi una console più pulita
        console.log(`SERVER: PortfolioPostsModel deletion for post_id ${pidAsNumber} - deletedCount: ${portfolioDeleteResult.deletedCount}`);

        // Tentativo di cancellazione da PostBlockModel
        // "se esistono li cancella altrimenti AMEN"
        const postBlockDeleteResult = await PostBlockModel.deleteMany({ post_id: pidAsNumber });
        // Log opzionale
        console.log(`SERVER: PostBlockModel deletion for post_id ${pidAsNumber} - deletedCount: ${postBlockDeleteResult.deletedCount}`);

        // L'operazione è considerata un successo a livello di API,
        // indipendentemente da quanti documenti sono stati effettivamente cancellati.
        return {
            ok: true,
            message: `Deletion process completed for ID: ${pidAsNumber}.`,
            portfolioItemsDeleted: portfolioDeleteResult.deletedCount,
            postBlockItemsDeleted: postBlockDeleteResult.deletedCount
        };

    } catch (dbError) {
        // Questo blocco catch intercetterà veri errori del database
        // (es. problemi di connessione, query malformate non previste, etc.)
        console.error('SERVER: Database error during delete operation:', dbError);
        // Restituisci un errore generico del server
        throw createError({
            statusCode: 500,
            message: 'An error occurred on the server while trying to delete data.'
        });
    }
});