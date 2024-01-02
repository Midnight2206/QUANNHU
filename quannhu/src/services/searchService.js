import * as httpRequest from '~/utils/httpRequest';

export const search = async (q, year) => {
    try {
        const res = await httpRequest.get(`quantrang/search`, {
            params: {
                q, 
                year
            }
        });
        if(res) {
            return res
        }
        else {
            console.error('Invalid response format during search request');
            throw new Error('Search request failed');
        }
    } catch (error) {
        console.log(error);
    }
};