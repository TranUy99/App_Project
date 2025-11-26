import API from "./api";

let Api = API.create();

export default class HeartRateService {
    async getLatestHeartRate(params: any) {
        let url = "api/heartrate/latest";
        return await Api.getToken(url, null, params?.token);
    }
}
