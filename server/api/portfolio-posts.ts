import { TPortfolioPosts, PortfolioPostsModel } from "../schema/PortfolioPostsSchema"

export default defineEventHandler(async () => {
const result = await PortfolioPostsModel.find({});
return result.map(item => item.toJSON()) as TPortfolioPosts[];
})