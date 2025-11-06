import API from "./api";

let Api = API.create();

export default class SettingService {
    async getSetting(params: any) {
        let url = "api_setting/getSettings";
        return await Api.getToken(url, null, params?.token);
    }
}
