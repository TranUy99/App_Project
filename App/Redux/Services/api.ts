import AsyncStorage from "@react-native-async-storage/async-storage";
import apisauce from "apisauce";

// info@hoanganhvn.com / @AnhHoang123456789

export let baseURL = 'https://erpla.hoanganhvn.com/api_shipping/';
// export let baseURL = "http://192.168.1.178/03320FLA/api_shipping/";

// Callback function khi token hết hạn
let onTokenExpiredCallback: (() => void) | null = null

let apiInstance: any = null;
let apiFormDataInstance: any = null;

// Hàm set callback từ bên ngoài
const setTokenExpiredCallback = (callback: () => void) => {
    onTokenExpiredCallback = callback
}
// Thêm monitor để check response 401 (token hết hạn)
const checkTokenExpired = (response: any) => {
    if (response?.status === 401) {
        console.log("onTokenExpiredCallback", onTokenExpiredCallback);
        
        // Gọi callback để logout và navigate
        if (onTokenExpiredCallback) {
            console.log('🚫 Token hết hạn - Status 401')
            onTokenExpiredCallback()
        }
    }
}

const setBaseURL = (url: string) => {
    baseURL = url;
    if (apiInstance) apiInstance.setBaseURL(baseURL);
    if (apiFormDataInstance) apiFormDataInstance.setBaseURL(baseURL);
};

const create = () => {
    apiInstance = apisauce.create({
        baseURL,
        headers: { Accept: "application/json" },
        timeout: 20000,
    });

    apiFormDataInstance = apisauce.create({
        baseURL,
        headers: { Accept: "multipart/form-data" },
        timeout: 120000,
    });

    apiInstance.addMonitor(checkTokenExpired)
    apiFormDataInstance.addMonitor(checkTokenExpired)

    const getLocale = async () => (await AsyncStorage.getItem("locale")) || "vn";

    const get = async (url: string, params?: any) => {
        const locale = await getLocale();
        return apiInstance.get(url, params, { headers: { locale } });
    };

    const post = async (url: string, body: any) => {
        const locale = await getLocale();
        return apiInstance.post(url, body, { headers: { locale } });
    };

    const postToken = async (url: string, body: any, token: string) => {
        const locale = await getLocale();
        return apiInstance.post(url, body, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token || "ha_delivery"}`,
                locale,
            },
        });
    };

    const getToken = async (url: string, body: any, token: string) => {
        const locale = await getLocale();
        return apiInstance.get(url, body, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token || "ha_delivery"}`,
                locale,
            },
        });
    };

    const postFormData = async (url: string, body: any, token: string) => {
        const locale = await getLocale();
        return apiFormDataInstance.post(url, body, {
            headers: {
                "Content-Type": "multipart/form-data",
                Authorization: `Bearer ${token || "ha_delivery"}`,
                locale,
            },
        });
    };

    const deleteToken = async (url: string, body: any, token: string) => {
        const locale = await getLocale();
        return apiInstance.delete(url, body, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token || "ha_delivery"}`,
                locale,
            },
        });
    };

    return {
        get,
        post,
        postToken,
        getToken,
        postFormData,
        deleteToken,
    };
};

export default {
    create,
    setBaseURL,
    setTokenExpiredCallback
};
