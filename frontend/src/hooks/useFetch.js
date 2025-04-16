import { useEffect, useState } from "react";
import axios from "axios";

export default function useFetch(url, options = {}) {
    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!url) return;

        const fetchData = async () => {
            try {
                setIsLoading(true);
                setError(null);

                const response = await axios({
                    url,
                    method: options.method || 'GET',
                    headers: options.headers || {},
                });

                setData(response.data);

                console.log("Response data from useFetch: ", response.data);
                

            } catch (err) {
                if (axios.isCancel(err)) return;
                setError(err.response?.data?.message || err.message || 'Something went wrong');
                setData(null);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();

        return () => {
            setData(null);
            setIsLoading(false);
            setError(null);
        };
    }, [url]);

    return [data, isLoading, error];
}