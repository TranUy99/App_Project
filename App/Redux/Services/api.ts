import apisauce from "apisauce";

//0397404101 - 12345678
//0901136968 - 12345678

// let baseURL = "http://localhost:3000";
let baseURL = "https://heart-rate-api-production-a3a6.up.railway.app";

const create = () => {
    const api = apisauce.create({
        baseURL,
        headers: {
            Accept: "application/json",
        },
        timeout: 20000,
    });

    const apiFormData = apisauce.create({
        baseURL,
        headers: {
            Accept: "multipart/form-data",
        },
        timeout: 20000,
    });

    const get = (url: string, params?: any) => api.get(url, params);
    const post = (url: string, params: any) => api.post(url, params);
    const postToken = (url: string, body: any, token: string) =>
        api.post(url, body, {
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        });
    const getToken = (url: string, body: any, token: string) =>
        api.get(url, body, {
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        });
    const postFormData = (url: string, body: any, token: string) =>
        apiFormData.post(url, body, {
            headers: { "Content-Type": "multipart/form-data", Authorization: `Bearer ${token}` },
        });
    const deleteToken = (url: string, body: any, token: string) =>
        api.delete(url, body, {
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token ? token : "gfc"}` },
        });

    return {
        get,
        post,
        postFormData,
        postToken,
        getToken,
        deleteToken,
    };
};

export default {
    create,
};
