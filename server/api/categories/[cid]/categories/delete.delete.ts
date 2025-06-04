import { PortfolioCatsModel } from '../../../../schema/PortfolioCategoriesSchema';

export default defineEventHandler(async event => {
    // const ctx = await requireUserSession(event); // Ricorda la sicurezza!

    const cidString = event.context.params?.cid.toString();

    if (!cidString) {
        console.warn('SERVER: Missing category id parameter from URL.');
        throw createError({ statusCode: 400, message: 'Missing category ID parameter' });
    }

    const { category } = await readBody(event);
    if (category === undefined) { // O un controllo più specifico se 'category' deve avere una certa struttura
        console.warn('SERVER: "category" data is missing in the request body.');
        throw createError({ status: 400, message: 'category data is required in body' });
    }

    try {
        console.log(`SERVER: "AMEN" Deletion - Attempting deletions for cat_id: ${cidString}`);

        // Tentativo di cancellazione da PortfolioPostsModel
        // "se esistono li cancella altrimenti AMEN"
        const catDeleteResult = await PortfolioCatsModel.deleteOne({ cat_id: cidString });
        // Log opzionale, puoi rimuoverlo se vuoi una console più pulita
        console.log(`SERVER: PortfolioPostsModel deletion for cat_id ${cidString} - deletedCount: ${catDeleteResult.deletedCount}`);
        return {
            ok: true,
            message: `Deletion process completed for ID: ${cidString}.`,
            //portfolioItemsDeleted: catDeleteResult.deletedCount,
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