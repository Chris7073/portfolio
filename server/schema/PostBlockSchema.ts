import { model, Schema, Types } from "mongoose";
export type TPostBlock = {
    id:string,
    post_id: number,
    block_name:string,
    block_position:string,
    block_title?:string,
    block_content: string,
    info?:{
        hover_effect?:boolean,
        image_url?:string,
        altText?:string,
        didascalia?:string,
    }[]
}

const PostBlockSchema = new Schema<TPostBlock>({
    id: { type: String },
    post_id: { type: Number },
    block_name: { type: String },
    block_position:{type:String},
    block_title:{type:String || null},
    block_content:{ type: String },
    info:[{ type: Schema.Types.Mixed || null}]
});

export const PostBlockModel = model<TPostBlock>("posts_blocks", PostBlockSchema);