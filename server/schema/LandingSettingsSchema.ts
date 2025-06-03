import { model, Schema, Types } from "mongoose";
export type TLandingSettings = {
    hero: boolean,
    hero_title: string,
    hero_desc: string,
    hero_bg: {
        bg_type: string,
        bg_text_color: string,
        bg_color_1: string,
        bg_color_2: string,
        bg_image: string,
    }[],
    hero_button: {
        active: boolean,
        text: string,
        link: string,
    }[],
    story: boolean,
    story_title: string,
    story_desc: string,
    story_img: string,
    story_me: [{
        me_id:number,
        me_icon: string,
        me_title: string,
        me_desc: string
    }]
}

const LandingSettingsSchema = new Schema<TLandingSettings>({
    hero: { type: Boolean },
    hero_title: { type: String },
    hero_desc: { type: String },
    hero_bg: [{ type: Schema.Types.Mixed }],
    hero_button: [{ type: Schema.Types.Mixed }],
    story: { type: Boolean },
    story_title: { type: String },
    story_desc: { type: String },
    story_img: { type: String },
    story_me: [{ type: Schema.Types.Mixed }],
});

export const landingSettingsModel = model<TLandingSettings>("landing_settings", LandingSettingsSchema);