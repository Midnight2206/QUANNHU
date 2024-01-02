import axios from 'axios';

const httpRequest = axios.create({
    baseURL: 'http://localhost:8080/',
});
export const get = async (path, options = {}) => {
    const response = await httpRequest.get(path, options);
    return response.data;
};
export const post = async (path, data, options = {}) => {
    const response = await httpRequest.post(path, data, options);
    return response;
}
export const put = async (path, data, options = {}) => {
    const response = await httpRequest.put(path, data, options);
    return response.data;
};

export const patch = async (path, data, options = {}) => {
    const response = await httpRequest.patch(path, data, options);
    return response.data;
};

export default httpRequest;