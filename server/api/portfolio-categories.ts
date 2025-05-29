import { TPortfolioCats, PortfolioCatsModel } from "../schema/PortfolioCategoriesSchema"

export default defineEventHandler(async () => {
const result = await PortfolioCatsModel.find({});
return result.map(item => item.toJSON()) as TPortfolioCats[];
})
