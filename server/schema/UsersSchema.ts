import { model, Schema, Types } from "mongoose";
export type TUsers = {
user_id:number,
user_name:string,
user_mail:string,
user_special_code:string
}

const UsersSchema = new Schema<TUsers>({
    user_id: { type: Number },
    user_name: { type: String },
    user_mail:{type:String},
    user_special_code:{ type: String }
});

export const UsersModel = model<TUsers>("users", UsersSchema);