import React, {useEffect, useState} from 'react';
import Accordion from 'react-bootstrap/Accordion';
import {useCookies} from "react-cookie";
import Popup from "../popup";
import axios from "axios";


function Nft(props) {
    const [cookies, setCookie] = useCookies(['user']);
    const [trigger, changeTrigger] = useState(false);
    const [value, changeValue] = useState("");
    const [d_list, changeList] = useState(undefined);
    const [d_lent, changeLent] = useState(undefined);
    const [reload, changeReload] = useState(true)

    useEffect(()=> {
        axios.get(props.domain + "/list").then((res)=>{
            changeList(res.data);
        })
        axios.post(props.domain + "/lendings", {user: cookies.name, pwd: cookies.pwd}).then((res)=>{
            changeLent(res.data)
        })
    },[reload])

    const lend = id =>{
        console.log(id);
        axios.post(props.domain+"/lend",{NFToken:id, mail:cookies.name, pwd:cookies.pwd}).then(
            (response)=>{
                if(response.data.message){
                    alert(response.data.message)
                }else if(response.data.error){
                    alert("Something went wrong. Please try again.")
                }else{
                    alert("The NFT song "+id+" is successfully rented.")
                }
                changeReload(true);
            }
        )
    }
    const lendHandler = e => {
        changeReload(false);
        let nft={};
        for(let d of d_list.result){
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
                    <div className="col-2"><strong>Token:</strong></div>
                    <div className="col-8">{nft.NFToken}</div>
                </div>
                <div className="row">
                    <button className="btn btn-primary mt-4" onClick={()=>{lend(nft.NFToken);changeTrigger(false)}}>Lend</button>
                </div>
            </div>
        );
        changeTrigger(true);
    }
    const returner = id => {
        axios.post(props.domain+"/return", {id:id, mail: cookies.name, pwd: cookies.pwd}).then((response)=>{
            alert(response.data.message);
            changeReload(true);
        })
    }
    const returnHandler = e =>{
        changeReload(false)
        let nft={};
        for(let d of d_lent.lending){
            console.log(d.LenId);
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

    return (
        <>
            <div className="container mt-4">
                <div className="row">
                    <h3 className="mb-4">NFT song menus</h3>
                    <Accordion defaultActiveKey="0">
                        <Accordion.Item eventKey="0">
                            <Accordion.Header>All NFT songs</Accordion.Header>
                            <Accordion.Body>
                                <div className="overflow-auto h-50">
                                    <table className="table table-hover">
                                        <thead>
                                        <tr>
                                            <th>Name</th>
                                            <th>Interpret</th>
                                            <th>Year</th>
                                            <th>Length</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {d_list?d_list.result.map((d,i)=>{
                                            return(
                                                <tr key={i+d.NFToken+"all"} id={d.NFToken} onClick={e => lendHandler(e)}>
                                                    <td>{d.NFName}</td>
                                                    <td>{d.NFInterpret}</td>
                                                    <td>{d.NFYear}</td>
                                                    <td>{d.NFLength}</td>
                                                </tr>
                                            );
                                        }) : <tr><td colSpan={4}>Loading</td></tr>}
                                        </tbody>
                                    </table>
                                </div>
                            </Accordion.Body>
                        </Accordion.Item>
                        <Accordion.Item eventKey="1">
                            <Accordion.Header>Rented NFT songs</Accordion.Header>
                            <Accordion.Body>
                                <div className="overflow-auto h-50">
                                    <h3>Currently on lending</h3>
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
                                        {d_lent?d_lent.lending.map((d,i)=>{
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

                            </Accordion.Body>
                        </Accordion.Item>
                    </Accordion>
                </div>
            </div>
            <Popup trigger={trigger} changeTrigger={changeTrigger}>
                {value}
            </Popup>
        </>
    );
}

export default Nft;