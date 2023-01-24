import React from 'react';
import usePost from "../../hook/usePost";
import {useCookies} from "react-cookie";
import useGet from "../../hook/useGet";

function Home(props) {
    const [cookies, setCookie] = useCookies(['user']);
    const domain = props.domain;
    const {data, loading} = usePost(domain+"/lendings", {user: cookies.name, pwd:cookies.pwd}) //get data from rented stuff
    const d = useGet(props.domain + "/list").data //get data from the nft table in db over server

    /*HTML OUTPUT*/
    if(data && d){
        return (
            <div className="mt-4">
                <h1>Home</h1>
                <div className="row mt-4">
                    <h3>Currently on lending</h3>
                    <table className="table">
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
                            {data.lending.length>0?data.lending.map((d,i)=>{ //displays the rented nfts (max. 5)
                                return(
                                <tr key={i}>
                                    <td>{d.NFName}</td>
                                    <td>{d.NFInterpret}</td>
                                    <td>{d.NFYear}</td>
                                    <td>{d.NFLength}</td>
                                    <td>{d.LenDate}</td>
                                </tr>
                                );
                            }):<tr><td colSpan={5}>Nothing here to see ;-)</td></tr>}
                        </tbody>
                    </table>
                </div>
                <div className="row mt-4">
                    <h3>Last 5 recent NFTs</h3>
                    <table className="table">
                        <thead>
                        <tr>
                            <th>Name</th>
                            <th>Interpret</th>
                            <th>Year</th>
                            <th>Length</th>
                        </tr>
                        </thead>
                        <tbody>
                        {d.result.length>0?d.result.reverse().map((d,i)=>{ //displays the last 5 added nfts
                            if(i<5) {
                                return (
                                    <tr key={i + "_" + d.NFToken + "all"} id={d.NFToken}>
                                        <td>{d.NFName}</td>
                                        <td>{d.NFInterpret}</td>
                                        <td>{d.NFYear}</td>
                                        <td>{d.NFLength}</td>
                                    </tr>
                                );
                            }else{
                                return "";
                            }
                        }) : <tr><td colSpan={4}>Nothing here to see ;-)</td></tr>}
                        </tbody>
                    </table>
                </div>
            </div>
        )
    }else if(loading){
        return(
            <div className="mt-4">
                <h1>Loading</h1>
            </div>
        );
    }else {
        return (
            <div className="mt-4">
                <h1>Successful login</h1>
            </div>
        );
    }
}

export default Home;