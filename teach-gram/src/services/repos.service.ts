import { API } from "./api";

export async function getUsersRepos(inputValue: string) {
    try {
        const responseUserRepos = await API.get(`/${inputValue}/repos`);
        return responseUserRepos.data;
    } catch (err) {
        throw new Error(err as string);
    }
}