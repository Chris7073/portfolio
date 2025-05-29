import { model, Schema, Types } from "mongoose";
export type TLandingSettings = {
    hero: boolean,
    hero_title: string,
    hero_desc: string,
    hero_bg: {
        bg_type: string,
        bg_text_color:string,
        bg_color_1: string,
        bg_color_2: string,
        bg_image: string,
    }[],
    hero_button: {
        active: boolean,
        text: string,
        link: string,
    }[]
}

const LandingSettingsSchema = new Schema<TLandingSettings>({
    hero: { type: Boolean },
    hero_title: { type: String },
    hero_desc: { type: String },
    hero_bg: [{ type: Schema.Types.Mixed }],
    hero_button: [{ type: Schema.Types.Mixed }],
});

export const landingSettingsModel = model<TLandingSettings>("landing_settings", LandingSettingsSchema);