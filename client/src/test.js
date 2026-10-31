const reverseGeocode = async ({ lat, lng }) => {
    const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
        {
            headers: {
                'User-Agent': 'BloodWeb/1.0 (namantiwari.dev@gmail.com)',
                'Accept-Language': 'en-US,en;q=0.9',
            },
        }
    );

    if (!res.ok) {
        console.log(await res.text());
        throw new Error('Failed to fetch address');
    }

    const data = await res.json();

    return data;
};

(async () => {
    try {
        const data = await reverseGeocode({ lat: 24.6, lng: 80.83 });
        console.log(JSON.stringify(data, null, 2));
    } catch (err) {
        console.log(err);
    }
})()