import API from "./api";

let Api = API.create();

export default class AuthService {
    async postLoginPhoneNumber(params: any) {
        let url = "auth/signin";
        return await Api.post(url, params);
    }
    async logout(params: any) {
        let url = "Api_Controller/Log_out";
        return await Api.postToken(url, params?.body, params?.token);
    }

}
