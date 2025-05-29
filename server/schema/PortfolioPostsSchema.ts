import { model, Schema, Types } from "mongoose";
export type TPortfolioPosts = {
    post_id: string,
    post_active:boolean,
    post_cat:string,
    post_name: string,
    post_desc:string,
    post_image:string,
}

const PortfolioPostsSchema = new Schema<TPortfolioPosts>({
    post_id: { type: String },
    post_active: { type: Boolean },
    post_cat:{type:String},
    post_name:{ type: String },
    post_desc:{ type: String },
    post_image:{ type: String }
});

export const PortfolioPostsModel = model<TPortfolioPosts>("portfolio_posts", PortfolioPostsSchema);