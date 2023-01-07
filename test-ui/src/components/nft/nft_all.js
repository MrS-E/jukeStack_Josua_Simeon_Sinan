import React, {useEffect, useRef, useState} from 'react';
import axios from "axios";
import {useCookies} from "react-cookie";
import Popup from "../popup";

function NFTAll(props) {
    const [cookies, setCookie] = useCookies(['user']);
    const [nfts, changeNFTs] = useState([]);
    const [loading, changeLoading] = useState(true);
    const [trigger, changeTrigger] = useState(false)
    const [value, changeValue] = useState("");
    const search = useRef(null);

    useEffect(() => {
        axios.get(props.domain + "/list").then((res) => {
            changeNFTs(res.data.result);
            changeLoading(false);
        })
    }, [])

    const lend = id =>{
        axios.post(props.domain+"/lend",{NFToken:id, mail:cookies.name, pwd:cookies.pwd}).then(
            (response)=>{
                if(response.data.message){
                    alert(response.data.message)
                }else if(response.data.error){
                    alert("Something went wrong. Please try again.")
                }else{
                    alert("The NFT song is successfully rented.")
                }
            }
        )
    }
    const lendHandler = e => {
        let nft={};
        for(let d of nfts){
            if(d.NFToken === e.currentTarget.id){
                nft=d;
                break;
            }
        }
        changeValue(
            <div>
                <h3>Lending</h3>
                <p>Do you want to lend the NFT song:</p>
                <div className="row">
                    <div className="col-2"><strong>Name:</strong></div>
                    <div className="col-8">{nft.NFName}</div>
                </div>
                <div className="row">
                    <div className="col-2"><strong>Interpret:</strong></div>
                    <div className="col-8">{nft.NFInterpret}</div>
                </div>
                <div className="row">
                    <div className="col-2"><strong>Year:</strong></div>
                    <div className="col-8">{nft.NFYear}</div>
                </div>
                <div className="row">
                    <div className="col-2"><strong>Length:</strong></div>
                    <div className="col-8">{nft.NFLength}</div>
                </div>
                <div className="row">
                    <button className="btn btn-primary mt-4" onClick={()=>{lend(nft.NFToken);changeTrigger(false)}}>Lend</button>
                </div>
            </div>
        );
        changeTrigger(true);
    }
    const update_values = (typ, value) =>{
        switch (typ){
            case "search":
                axios.post(props.domain+"/nft_search", {search: value}).then((res)=>{
                    changeNFTs(res.data);
                    console.log(res.data)
                })
                break;
            case "normal":
                axios.get(props.domain + "/list").then((res) => {
                    changeNFTs(res.data.result);
                })
                break;
        }
    }

    if(!loading){
        return (
            <>
                <div className="mt-4">
                    <h3>All NFTs</h3>
                    <div className="row">
                        <div className="col-12">
                            <input type="text" ref={search} className="form-control" onChange={()=>update_values("search", search.current.value)} placeholder="Search"/>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-12">
                            <table className="table table-hover">
                                <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Interpret</th>
                                    <th>Length</th>
                                    <th>Year</th>
                                </tr>
                                </thead>
                                <tbody>
                                {nfts ? nfts.map((d, key) => {
                                    return (
                                        <tr key={key + "_" + d.NFToken + "_nfts"} id={d.NFToken} onClick={e => lendHandler(e)}>
                                            <td>{d.NFName}</td>
                                            <td>{d.NFInterpret}</td>
                                            <td>{d.NFLength}</td>
                                            <td>{d.NFYear}</td>
                                        </tr>
                                    );
                                }) :
                                    <tr>
                                        <td colSpan={5}>Loading</td>
                                    </tr>}
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

export default NFTAll;