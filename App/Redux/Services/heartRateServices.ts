import API from "./api";

let Api = API.create();

export default class HeartRateService {
    async getLatestHeartRate(params: any) {
        let url = "api/heartrate/latest";
        return await Api.getToken(url, null, params?.token);
    }
    async getHistoricalHeartRate(params: any) {
        console.log("getHistoricalHeartRate params", params);

        let url = "api/heartrate/history?userId=" + params?.userId + "&period=" + params?.period + "&limit=" + 100;
        return await Api.getToken(url, null, params?.token);
    }
}
