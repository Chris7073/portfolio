import {model,Schema, Types} from "mongoose";
export type TPortfolioCats = {
   cat_id:string,
   cat_name:string,
   cat_desc:string
}

const PortfolioCatsSchema = new Schema<TPortfolioCats>({
    cat_id:{type:String},
    cat_name:{type:String},
    cat_desc:{type:String}
});

export const PortfolioCatsModel = model<TPortfolioCats>("portfolio_categories",PortfolioCatsSchema);