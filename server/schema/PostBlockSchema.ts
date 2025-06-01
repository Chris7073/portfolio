import { model, Schema, Types } from "mongoose";
export type TPostBlock = {
    id:string,
    post_id: string,
    block_name:string,
    block_position:string,
    block_title?:string,
    block_content: string,
}

const PostBlockSchema = new Schema<TPostBlock>({
        id: { type: String },
    post_id: { type: String },
    block_name: { type: String },
    block_position:{type:String},
    block_title:{type:String || null},
    block_content:{ type: String },
});

export const PostBlockModel = model<TPostBlock>("posts_blocks", PostBlockSchema);