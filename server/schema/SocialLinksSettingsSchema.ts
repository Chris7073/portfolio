import {model,Schema, Types} from "mongoose";
export type TSocialSettings = {
   id:string,
   link:string,
   icon:number,
   active:boolean,
}

const socialSettingsSchema = new Schema<TSocialSettings>({
    id:{type:String},
    link:{type:String},
    icon:{type:Number},
    active:{type:Boolean},
});

export const socialLinksModel = model<TSocialSettings>("web_social_links",socialSettingsSchema);