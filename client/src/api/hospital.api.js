import client from "./client.js";

export async function searchHospitals(query, city, page = 1, limit = 10) {
    const { data } = await client.get('/api/hospital/search', { params: { query, city, page, limit } });

    return data.data;
}