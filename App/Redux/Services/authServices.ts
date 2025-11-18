import API from "./api";

const api = API.create();

class AuthService {
    async login(payload: { email: string; password: string }) {
        return api.post("/api/auth/login", payload);
    }

    async postLoginPhoneNumber(params: any) {
        let url = "auth/signin";
        return await api.post(url, params);
    }
    async logout(params: any) {
        let url = "Api_Controller/Log_out";
        return await api.postToken(url, params?.body, params?.token);
    }
    async register(payload: { name: string; email: string; password: string }) {
        return api.post("/api/auth/register", payload);
    }
}

export default AuthService;
