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
    async analyzeHeartRate(params: any) {
        let url = "api/heartrate/analyze";
        return await Api.postToken(url, params?.data, params?.token);
    }
    async getHeartRateTrend(params: any) {
        let url = `api/heartrate/trend?userId=${params?.userId}&days=${params?.days}`;
        return await Api.getToken(url, null, params?.token);
    }
}
