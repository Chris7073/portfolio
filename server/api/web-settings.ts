import { TWebSettings, WebSettingsModel } from "../schema/WebSettingsSchema"

export default defineEventHandler(async () => {
const result = await WebSettingsModel.findOne({});
return result?.toJSON() as TWebSettings;
})