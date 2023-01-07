import {useEffect, useState} from "react";
import axios from "axios";

function useGet(url) { //react hook for getting data from server
    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    useEffect(() => {
        setLoading(true);
        axios //server request
            .get(url)
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

    return {data, loading, error} //returning data as object after fetch and while fetch
}
export default useGet;