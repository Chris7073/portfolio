import { TUsers, UsersModel } from "../schema/UsersSchema"

export default defineEventHandler(async () => {
const result = await UsersModel.findOne({});
return result?.toJSON() as TUsers;
})

