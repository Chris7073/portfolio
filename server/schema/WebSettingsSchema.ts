import { model, Schema, Types } from "mongoose";
export type TWebSettings = {
    name: string,
    desc: string,
    mail: string,
    analytics:string,
    maintenance: boolean,
    maintenance_desc: string
}

const WebSettingsSchema = new Schema<TWebSettings>({
    name: { type: String },
    desc: { type: String },
    mail: { type: String },
    analytics: { type: String },
    maintenance: { type: Boolean },
    maintenance_desc: { type: String },

});

export const WebSettingsModel = model<TWebSettings>("web_settings", WebSettingsSchema);