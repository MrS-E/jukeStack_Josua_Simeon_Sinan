import React, {useEffect, useRef, useState} from 'react';
import axios from "axios";
import {useCookies} from "react-cookie";
import {Button, Form} from "react-bootstrap";
import Popup from "../popup";

function AdminNfts(props) {
    const [cookies, setCookie] = useCookies(['user']);
    const [checked, changeCheck] = useState(false);
    const [loading, changeLoading] = useState(true);
    const [trigger, changeTrigger] = useState(false)
    const [value, changeValue] = useState("");
    const interpret = useRef(null);
    const name = useRef(null);
    const year = useRef(null);
    const lenght = useRef(null);
    const sub = useRef(null);

    useEffect( ()=> {
        axios.post(props.domain + "/admin/check", {user: cookies.name, pwd: cookies.pwd, attributes: {}})
            .then((res_check)=>{
                changeCheck(res_check.data[0].admin==="true"?true:false);
                changeLoading(false)
            })
    },[])

    const new_nft = () =>{
        sub.current.setAttribute("disabled", true)
        changeTrigger(false);
        axios.post(props.domain+"/admin/add_nft", {user: cookies.name, pwd: cookies.pwd, attributes:{interpret: interpret.current.value, name: name.current.value, length: lenght.current.value.toString()+":00", year: year.current.value}}).then(
            ()=>{
                alert("NFT was added...")
                sub.current.removeAttribute("disabled")
            }
        )
    }
    const add_nft = () => {
        changeValue(
            <>
                <h3>Add NFT</h3>
                <Form>
                    <Form.Group className="mb-3">
                        <Form.Label>Interpret</Form.Label>
                        <Form.Control ref={interpret} type="text" placeholder="Enter interpret" />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Song name</Form.Label>
                        <Form.Control ref={name} type="text" placeholder="Enter song name" />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Year</Form.Label>
                        <Form.Control ref={year} type="number" min="1000" max="9999"/>
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Song length</Form.Label>
                        <Form.Control ref={lenght} type="time" placeholder="Enter length" />
                    </Form.Group>
                    <Button ref={sub} variant="primary" type="button" onClick={new_nft}>
                        Submit
                    </Button>
                </Form>
            </>
        );
        changeTrigger(true);
    }

    if(checked && !loading) {
        return (
            <>
                <div className="mt-4">
                   <button onClick={add_nft}>add nft</button>
                </div>
                <Popup trigger={trigger} changeTrigger={changeTrigger}>
                    {value}
                </Popup>
            </>
        );
    }else if(loading){
        return (
            <div className="mt-4">
                <h3>Loading</h3>
            </div>
        )
    }else{
        return(
            <div className="mt-4">
                <h3>You are a bit misguided, please go back to the normal sites.</h3>
            </div>
        );
    }
}

export default AdminNfts;