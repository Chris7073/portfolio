import { PostBlockModel, TPostBlock } from "../schema/PostBlockSchema"

export default defineEventHandler(async () => {
const result = await PostBlockModel.find({});
if(!result) return [];
return result.map(item => item.toJSON()) as TPostBlock[];
})
