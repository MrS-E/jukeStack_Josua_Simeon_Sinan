import React, {useEffect, useState} from "react";
import axios from "axios";

function UsePost(url, data) {
    const [data_out, setData] = useState(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    useEffect(() => {
        setLoading(true);
        axios
            .post(url, data)
            .then((response) =>{
                setData(response.data);
            })
            .catch((err) =>{
                setError(err)
            })
            .finally(() => {
                setLoading(false);
            })
    }, [url, data]);

    return {data_out, loading, error}
}
export default UsePost;