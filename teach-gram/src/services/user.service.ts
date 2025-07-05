import { API } from "./api";

export async function getUsers(inputValue: string) {
    try {
        const responseUser = await API.get(`/${inputValue}`);
        return responseUser.data;
    } catch (err) {
        throw new Error(err as string);
    }
}