import React from 'react';
import usePost from "../../hook/usePost";
import {useCookies} from "react-cookie";

function Home(props) {
    const [cookies, setCookie] = useCookies(['user']);
    const domain = props.domain;
    const {data, loading} = usePost(domain+"/lendings", {user: cookies.name, pwd:cookies.pwd})
    if(data){
        return (
            <div className="mt-4">
                <h1>Home</h1>
                <div className="row mt-4">
                    <h3>Currently on lending</h3>
                    <table className="table table-hover">
                        <thead>
                           <tr>
                               <th>NFT Name</th>
                               <th>NFT Interpret</th>
                               <th>NFT Year</th>
                               <th>NFT Length</th>
                               <th>Lending start</th>
                           </tr>
                        </thead>
                        <tbody>
                            {data.lending.map((d,i)=>{
                                return(
                                <tr key={i}>
                                    <td>{d.NFName}</td>
                                    <td>{d.NFInterpret}</td>
                                    <td>{d.NFYear}</td>
                                    <td>{d.NFLength}</td>
                                    <td>{d.LenDate}</td>
                                </tr>
                                );
                            })}
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