import React, {useEffect, useState} from 'react';
import axios from "axios";
import {useCookies} from "react-cookie";

function NFTHistory(props) {
    const [cookies, setCookie] = useCookies(['user']);
    const [nfts, changeNFTs] = useState([]);
    const [loading, changeLoading] = useState(true);

    useEffect(() => {
        axios.post(props.domain+"/history", {mail: cookies.name, pwd: cookies.pwd}).then((res)=>{
            changeNFTs(res.data.history);
            changeLoading(false);
        })
    }, [])


    if(!loading){
        return (
            <>
                <div className="mt-4">
                    <h3>NFT history</h3>
                    <div className="row">
                        <div className="col-12">
                            <table className="table table-hover">
                                <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Interpret</th>
                                    <th>Year</th>
                                    <th>Length</th>
                                    <th>Lending start</th>
                                    <th>Lending End</th>
                                </tr>
                                </thead>
                                <tbody>
                                {nfts?nfts.map((d,i)=>{
                                    return(
                                        <tr key={i+"_"+d.NFToken+"_history"}>
                                            <td>{d.NFName}</td>
                                            <td>{d.NFInterpret}</td>
                                            <td>{d.NFYear}</td>
                                            <td>{d.NFLength}</td>
                                            <td>{d.LenDateStart}</td>
                                            <td>{d.LenDateEnd}</td>
                                        </tr>
                                    );
                                }):<tr><td colSpan={5}>Loading</td></tr>}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </>
        );
    }
    else if (loading) {
        return (
            <div className="mt-4">
                <h3>Loading</h3>
            </div>
        )
    }
    else {
        return (
            <div className="mt-4">
                <h3>Something went wrong please reload the side.</h3>
            </div>
        );
    }
}

export default NFTHistory;