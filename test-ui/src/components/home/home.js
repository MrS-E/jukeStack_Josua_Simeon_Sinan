import React from 'react';
import useGet from "../../hook/useGet";

function Home(props) {
    const user = props.user;
    const domain = props.domain;
    const {data, loading} = useGet(domain+"/lendings/?user="+user);
    if(data) console.log(data);

    if(data){
        return (
            <div>
                <h1>Home</h1>
                <div className="row mt-4">
                    <h3>Signed in as user:</h3>
                    <p><strong>{user}</strong></p>
                </div>
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
            <div>
                <h1>Loading</h1>
            </div>
        );
    }else {
        return (
            <div>
                <h1>Successful login</h1>
            </div>
        );
    }
}

export default Home;