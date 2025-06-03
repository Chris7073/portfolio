import {model,Schema, Types} from "mongoose";
export type TWebSettings = {
   name:string,
   desc:string,
   mail:string,
   maintenance:boolean,
}

const WebSettingsSchema = new Schema<TWebSettings>({
    name:{type:String},
    desc:{type:String},
    mail:{type:String},
    maintenance:{type:Boolean},
});

export const WebSettingsModel = model<TWebSettings>("web_settings",WebSettingsSchema);