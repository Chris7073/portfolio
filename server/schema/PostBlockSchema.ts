// Corrected PostBlockSchema.ts (conceptual changes for clarity)
import { model, Schema, Types } from "mongoose";

export type TPostBlockInfo = {
    hover_effect?:boolean;
    image_url?:string;
    altText?:string;
    didascalia?:string; // Typo from original, kept for consistency if DB uses it
};

export type TPostBlock = {
    id: string; // Unique identifier for the block (e.g., UUID)
    post_id: number;
    block_name: string;
    block_position: number;
    block_title?: string;
    block_content: string;
    info?: TPostBlockInfo[];
};

const PostBlockSchema = new Schema<TPostBlock>({
    id: { type: String, required: true, unique: true }, // Made 'id' required and unique
    post_id: { type: Number, required: true, index: true }, // Added required and index
    block_name: { type: String, required: true },
    block_position: { type: Number, required: true },
    block_title: { type: String, required: false }, // Corrected type
    block_content: { type: String, required: true },
    info: [{ type: Schema.Types.Mixed, required: false }] // Corrected type for array elements
}, { _id: true }); // You can decide if you want MongoDB's default _id or rely solely on your 'id'

export const PostBlockModel = model<TPostBlock>("posts_blocks", PostBlockSchema);
