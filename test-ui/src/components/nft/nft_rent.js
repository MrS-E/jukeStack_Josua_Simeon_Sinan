import React, {useEffect, useState} from 'react';
import axios from "axios";
import {useCookies} from "react-cookie";
import Popup from "../popup";

function NFTRent(props) {
    const [cookies, setCookie] = useCookies(['user']);
    const [nfts, changeNFTs] = useState([]);
    const [loading, changeLoading] = useState(true);
    const [trigger, changeTrigger] = useState(false)
    const [value, changeValue] = useState("");

    useEffect(() => {
        axios.post(props.domain + "/lendings", {user: cookies.name, pwd: cookies.pwd}).then((res)=>{
            changeNFTs(res.data.lending);
            changeLoading(false);
        })
    }, [])

    const returner = id => {
        axios.post(props.domain+"/return", {id:id, mail: cookies.name, pwd: cookies.pwd}).then((response)=>{
            update_values()
            alert(response.data.message);
        })
    }
    const update_values = () =>{
        axios.post(props.domain + "/lendings", {user: cookies.name, pwd: cookies.pwd}).then((res)=>{
            changeNFTs(res.data.lending);
        })
    }
    const returnHandler = e =>{
        let nft={};
        for(let d of nfts){
            if(d.LenId.toString() === e.currentTarget.id.toString()){
                nft=d;
                break;
            }
        }
        changeValue(
            <div>
                <h3>Lending with RentId {nft.LenId}</h3>
                <div className="row">
                    <div className="col-3"><strong>Name:</strong></div>
                    <div className="col-8">{nft.NFName}</div>
                </div>
                <div className="row">
                    <div className="col-3"><strong>Interpret:</strong></div>
                    <div className="col-8">{nft.NFInterpret}</div>
                </div>
                <div className="row">
                    <div className="col-3"><strong>Year:</strong></div>
                    <div className="col-8">{nft.NFYear}</div>
                </div>
                <div className="row">
                    <div className="col-3"><strong>Length:</strong></div>
                    <div className="col-8">{nft.NFLength}</div>
                </div>
                <div className="row">
                    <div className="col-3"><strong>Lending start:</strong></div>
                    <div className="col-8">{nft.LenDate}</div>
                </div>
                <div className="row">
                    <div className="col-3"><strong>Lending start:</strong></div>
                    <div className="col-8">{nft.LenDate}</div>
                </div>
                <div className="row">
                    <div className="col-6">
                        <button className="btn btn-primary mt-4" onClick={()=>{returner(nft.LenId);changeTrigger(false)}}>Return</button>
                    </div>
                    <div className="col-6">
                        <button className="btn btn-primary mt-4" onClick={()=>{alert("Not implemented...")}}>Listen to</button>
                    </div>
                </div>
            </div>
        );
        changeTrigger(true);
    }

    if(!loading){
        return (
            <>
                <div className="mt-4">
                    <h3>Rented NFTs</h3>
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
                                </tr>
                                </thead>
                                <tbody>
                                {nfts?nfts.map((d,i)=>{
                                    return(
                                        <tr key={i} id={d.LenId} onClick={e=>returnHandler(e)}>
                                            <td>{d.NFName}</td>
                                            <td>{d.NFInterpret}</td>
                                            <td>{d.NFYear}</td>
                                            <td>{d.NFLength}</td>
                                            <td>{d.LenDate}</td>
                                        </tr>
                                    );
                                }):<tr><td colSpan={5}>Loading</td></tr>}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                <Popup trigger={trigger} changeTrigger={changeTrigger}>
                    {value}
                </Popup>
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

export default NFTRent;