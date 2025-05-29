import { TLandingSettings, landingSettingsModel } from "../schema/LandingSettingsSchema"

export default defineEventHandler(async () => {
const result = await landingSettingsModel.findOne({});
return result?.toJSON() as TLandingSettings;
})