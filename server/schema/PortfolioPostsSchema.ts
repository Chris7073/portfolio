import { model, Schema } from "mongoose"; // Types removed as not used here

export type TPortfolioPosts = {
    post_id: number;
    post_active: boolean;
    post_cat: string;
    post_name: string;
    post_desc: string;
    post_image?: string;
    blocks?:[{
        block_id:number;
        block_name:string;
        block_title:string;
        block_content:string;
        block_position:number; 
        hover_effect:boolean;
        image_url?:string;
        altText?:string;
        didascalia?:string;
        cards?:[{
            c_id:number,
            c_title:string,
            c_desc:string,
            c_icon:string
        }]
    }]
};

const PortfolioPostsSchema = new Schema<TPortfolioPosts>({
    post_id: {
        type: Number,
        required: true,
        unique: true
    },
    post_active: { type: Boolean, default: false }, // Added default
    post_cat: { type: String }, 
    post_name: { type: String, required: true },
    post_desc: { type: String, required: false },
    post_image: { type: String, required: false },
    blocks:[{
        block_id:{type:Number,required:true},
        block_name:{ type: String, required: true },
        block_title:{ type: String, required:false, default:'block title' },
        block_content:{ type: String, required:false, default:'block content text' },
        block_position:{type:Number,required:true},
        hover_effect:{type:Boolean,required:true,default:false},
        image_url:{ type: String, required:false, default:'https://placehold.co/1000x1000' },
        altText:{ type: String, required: false },
        didascalia:{ type: String, required: false },
        cards: [{
            // Definiamo la struttura di una singola card
            c_id: { type: Number, required: true },
            c_title: { type: String, required: false, default: '' },
            c_desc: { type: String, required: false, default: '' },
            c_icon: { type: String, required: false, default: '' }
        }]
    }]
});

export const PortfolioPostsModel = model<TPortfolioPosts>("portfolio_posts", PortfolioPostsSchema);