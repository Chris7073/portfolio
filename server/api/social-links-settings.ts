import { TSocialSettings,socialLinksModel } from "../schema/SocialLinksSettingsSchema"

export default defineEventHandler(async () => {
const result = await socialLinksModel.find({});
if(!result) return [];
return result.map(e => e.toJSON()) as TSocialSettings[];
})