import { IUser } from "./user.type";

export interface ILoginResponse {
    token: string;
    accessToken: string;
    refreshToken: string;
    user: IUser;
}
