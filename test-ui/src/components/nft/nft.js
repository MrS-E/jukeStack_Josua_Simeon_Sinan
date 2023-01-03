import React, {useState} from 'react';
import {useCookies} from "react-cookie";
import useGet from "../../hook/useGet";
import Popup from "../popup";
import axios from "axios";

function Nft(props) {
    const [cookies, setCookie] = useCookies(['user']);
    const [trigger, changeTrigger] = useState(false);
    const [value, changeValue] = useState("");
    const {data, loading} = useGet(props.domain+"/list");

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
            }
        )
    }
    const lendHandler = e =>{
        changeTrigger(true);
        let nft={};
        for(let d of data.result){
            if(d.NFToken === e.currentTarget.id){
                nft=d;
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
                    <button type="submit" className="btn btn-primary mt-4" onClick={()=>{lend(nft.NFToken);changeTrigger(false)}}>Submit</button>
                </div>
            </div>
        );

    }

    return (
        <>
            <div className="container">
                <div className="row">
                    <div className="col-6 overflow-auto" style={{height: "90vh"}}>
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
                            {data?data.result.map((d)=>{
                            return(
                                <tr key={d.NFToken} id={d.NFToken} onClick={e => lendHandler(e)}>
                                    <td>{d.NFName}</td>
                                    <td>{d.NFInterpret}</td>
                                    <td>{d.NFYear}</td>
                                    <td>{d.NFLength}</td>
                                </tr>
                            );
                            }) : <tr><td>Loading</td></tr>}
                            </tbody>
                        </table>
                    </div>
                    <div className="col-6 overflow-auto" style={{height: "90vh"}}>

                    </div>
                </div>
            </div>
            <Popup trigger={trigger} changeTrigger={changeTrigger}>
                {value}
            </Popup>
        </>
    );
}

export default Nft;