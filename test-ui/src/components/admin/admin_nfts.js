import React, {useEffect, useRef, useState} from 'react';
import axios from "axios";
import {useCookies} from "react-cookie";
import {Button, Form} from "react-bootstrap";

function AdminNfts(props) {
    const [cookies, setCookie] = useCookies(['user']);
    const [checked, changeCheck] = useState(false);
    const [loading, changeLoading] = useState(true);
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
        axios.post(props.domain+"/admin/add_nft", {user: cookies.name, pwd: cookies.pwd, attributes:{interpret: interpret.current.value, name: name.current.value, length: lenght.current.value.toString()+":00", year: year.current.value}}).then(
            ()=>{
                alert("NFT was added...")
                sub.current.removeAttribute("disabled")
            }
        )
    }

    if(checked && !loading) {
        return (
            <div>
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
            </div>
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