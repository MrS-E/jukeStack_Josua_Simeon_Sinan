import {useEffect, useState} from "react";
import axios from "axios";

function usePost(url, data_in) { //react hook to fetch data
    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    useEffect(() => {
        setLoading(true);
        axios //server request
            .post(url, data_in)
            .then((response) =>{
                setData(response.data);
            })
            .catch((err) =>{
                setError(err)
            })
            .finally(() => {
                setLoading(false);
            })
    }, [url]);

    return {data, loading, error} //returns data after fetch
}
export default usePost;