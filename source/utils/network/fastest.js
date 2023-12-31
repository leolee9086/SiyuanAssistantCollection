import { got } from "./got.js";
export const getFastestEndpointWithAllSuccess= async (endpoints)=>{
    const requests = endpoints.map((endpoint) => {
        return new Promise(async (resolve, reject) => {
            try {
                const response = await got(endpoint);
                if (response.statusCode >= 200 && response.statusCode < 300) {
                    resolve(endpoint);
                } else {
                    reject(`Error while accessing endpoint ${endpoint}: Status code ${response.statusCode}`);
                }
            } catch (error) {
                reject(`Error while accessing endpoint ${endpoint}: ${error}`);
            }
        });
    });
    return Promise.race(requests);
}
export const getFastestEndpoint = async (endpoints) => {
    const requests = endpoints.map((endpoint) => {
        return new Promise(async (resolve) => {
            try {
                const response = await got(endpoint);
                if (response.statusCode >= 200 && response.statusCode < 300) {
                    resolve(endpoint);
                }
            } catch (error) {
                console.error(`Error while accessing endpoint ${endpoint}: ${error}`);
            }
        });
    });

    try {
        const successfulEndpoint = await Promise.any(requests);
        return successfulEndpoint;
    } catch (error) {
        console.error('All requests failed');
        return null;
    }
}