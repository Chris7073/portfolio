import {model,Schema, Types} from "mongoose";
export type TWebSettings = {
   name:string,
   desc:string,
   mail:string,
}

const WebSettingsSchema = new Schema<TWebSettings>({
    name:{type:String},
    desc:{type:String},
    mail:{type:String},
});

export const WebSettingsModel = model<TWebSettings>("web_settings",WebSettingsSchema);