import { TUsers, UsersModel } from "../../schema/UsersSchema"

export default defineEventHandler(async (event) => {
    console.log('API /api/auth/ chiamata');
    try {
        const body = await readBody(event);
        const getPinCode = body.code;  // ora prende il campo "code"
        const cleanPinCode = getPinCode.join('');
        const user = await UsersModel.findOne({ user_mail: body.mail });

        console.log('Pin code ricevuto per la mail:', body.mail, cleanPinCode, 'verifico se è giusto...');

        if (!user || cleanPinCode !== user.user_special_code) {
            console.log('Pin code errato:', cleanPinCode);
            return { success: false };
        }
        // Qui salvi la sessione usando nuxt-auth-utils
        await setUserSession(event, {
            user: {
                id: user.user_id,
                name: user.user_name,
                mail: user.user_mail,
            },
        });
        console.log('login approvato.')
        return { success: true };

    } catch (error) {
        console.error('Errore in API auth:', error);
        return { success: false, error: 'Internal server error' };
    }
});