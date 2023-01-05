import React, {useEffect, useRef, useState} from 'react';
import axios from "axios";
import {useCookies} from "react-cookie";
import {Button, Form} from "react-bootstrap";
import Popup from "../popup";

function AdminNfts(props) {
    const [cookies, setCookie] = useCookies(['user']);
    const [checked, changeCheck] = useState(false);
    const [nfts, changeNFTs] = useState([]);
    const [loading, changeLoading] = useState(true);
    const [trigger, changeTrigger] = useState(false)
    const [value, changeValue] = useState("");
    const interpret = useRef(null);
    const name = useRef(null);
    const year = useRef(null);
    const lenght = useRef(null);
    const sub = useRef(null);

    useEffect(() => {
        axios.post(props.domain + "/admin/check", {user: cookies.name, pwd: cookies.pwd, attributes: {}})
            .then((res_check) => {
                changeCheck(res_check.data[0].admin === "true");
                if (res_check.data[0].admin === "true") {
                    axios.post(props.domain + "/admin/nfts", {user: cookies.name, pwd: cookies.pwd}).then((res) => {
                        changeNFTs(res.data);
                        changeLoading(false);
                    })
                } else {
                    changeLoading(false)
                }
            })
    }, [])

    const new_nft = () => {
        //sub.current.setAttribute("disabled", true)
        //changeTrigger(false);
        axios.post(props.domain + "/admin/add_nft", {
            user: cookies.name,
            pwd: cookies.pwd,
            attributes: {
                interpret: interpret.current.value,
                name: name.current.value,
                length: "00:" + lenght.current.value.toString(),
                year: year.current.value
            }
        }).then(
            () => {
                alert("NFT was added...")
                sub.current.removeAttribute("disabled")
            }
        )
    }
    const delete_nft = token =>{
        changeTrigger(false);
        axios.post(props.domain+"/admin/delete_nft", {user: cookies.name, pwd: cookies.pwd, attributes: {token:token}})
             .then(()=>{
                 alert("NFT is deleted");
             })
    }
    const edit_nft = nft =>{
        changeValue(
            <div>
                <h3>Edit NFT</h3>
                <p>Keep input empty if you want keep data</p>
                <Form.Group className="mb-3">
                    <Form.Label>Interpret</Form.Label>
                    <Form.Control ref={interpret} type="text" placeholder="Enter interpret"/>
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Song name</Form.Label>
                    <Form.Control ref={name} type="text" placeholder="Enter song name"/>
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Year</Form.Label>
                    <Form.Control ref={year} type="number" min="1000" max="9999" placeholder="2023"/>
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Song length</Form.Label>
                    <Form.Control ref={lenght} type="time" placeholder="Enter length"/>
                </Form.Group>
                <Button ref={sub} variant="primary" type="button" onClick={new_nft}>
                    Submit
                </Button>
            </div>
        )
        changeTrigger(false)
        axios.post(props.domain+"/admin/edit_nft", {user: cookies.name, pwd: cookies.pwd, attributes: {token: nft.NFToken, name: name.current.value?name.current.value:nft.NFName, interpret: interpret.current.value?interpret.current.value:nft.NFInterpret, lenght: lenght.current.value?lenght.current.value:nft.NFLength, year:year.current.value?year.current.value:nft.NFYear}})
             .then(()=>{
                 alert("NFT was changed")
             })
    }
    const add_nft = () => {
        changeValue(
            <>
                <h3>Add NFT</h3>
                <Form>
                    <Form.Group className="mb-3">
                        <Form.Label>Interpret</Form.Label>
                        <Form.Control ref={interpret} type="text" placeholder="Enter interpret"/>
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Song name</Form.Label>
                        <Form.Control ref={name} type="text" placeholder="Enter song name"/>
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Year</Form.Label>
                        <Form.Control ref={year} type="number" min="1000" max="9999" placeholder="2023"/>
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Song length</Form.Label>
                        <Form.Control ref={lenght} type="time" placeholder="Enter length"/>
                    </Form.Group>
                    <Button ref={sub} variant="primary" type="button" onClick={new_nft}>
                        Submit
                    </Button>
                </Form>
            </>
        );
        changeTrigger(true);
    }
    const nftHandler = e => {
        console.log(e.currentTarget.id)
        let nft = {};
        for(let d of nfts){
            if(d.NFToken === e.currentTarget.id){
                nft = d;
                break;
            }
        }

        changeValue(
            <div>
                <h3>NFT</h3>
                <div className="row">
                    <div className="col-3"><strong>Token:</strong></div>
                    <div className="col-9">{nft.NFToken}</div>
                </div>
                <div className="row">
                    <div className="col-3"><strong>Name:</strong></div>
                    <div className="col-9">{nft.NFName}</div>
                </div>
                <div className="row">
                    <div className="col-3"><strong>Interpret:</strong></div>
                    <div className="col-9">{nft.NFInterpret}</div>
                </div>
                <div className="row">
                    <div className="col-3"><strong>Year:</strong></div>
                    <div className="col-9">{nft.NFYear}</div>
                </div>
                <div className="row">
                    <div className="col-3"><strong>Length:</strong></div>
                    <div className="col-9">{nft.NFLength}</div>
                </div>
                <div className="row">
                    <button className="btn btn-primary m-1" onClick={()=>delete_nft(nft.NFToken)}>Delete</button>
                    <button className="btn btn-primary m-1" onClick={()=>edit_nft(nft)}>Edit</button>
                </div>
            </div>
        )
        changeTrigger(true);
    }

    if (checked && !loading) {
        return (
            <>
                <div className="mt-4">
                    <h3>NFTs admin panel</h3>
                    <div className="row">
                        <button className="btn btn-info" onClick={add_nft}>add nft</button>
                    </div>
                    <div className="row">
                        <h5>All NFTs</h5>
                        <table className="table table-hover">
                            <thead>
                            <tr>
                                <th>Token</th>
                                <th>Name</th>
                                <th>Interpret</th>
                                <th>Length</th>
                                <th>Year</th>
                            </tr>
                            </thead>
                            <tbody>
                            {nfts?nfts.map((d, key)=>{
                                return(
                                    <tr key={key+"_"+d.NFToken+"_admin_nfts"} id={d.NFToken} onClick={e=>nftHandler(e)}>
                                        <td>{d.NFToken}</td>
                                        <td>{d.NFName}</td>
                                        <td>{d.NFInterpret}</td>
                                        <td>{d.NFLength}</td>
                                        <td>{d.NFYear}</td>
                                    </tr>
                                );
                            }):<tr><td colSpan={5}>Loading</td></tr>}
                            </tbody>
                        </table>
                    </div>
                </div>
                <Popup trigger={trigger} changeTrigger={changeTrigger}>
                    {value}
                </Popup>
            </>
        );
    } else if (loading) {
        return (
            <div className="mt-4">
                <h3>Loading</h3>
            </div>
        )
    } else {
        return (
            <div className="mt-4">
                <h3>You are a bit misguided, please go back to the normal sites.</h3>
            </div>
        );
    }
}

export default AdminNfts;