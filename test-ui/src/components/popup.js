import React from 'react';
import "./css/style.css";

function Popup(props) {
    if(props.trigger){
        return(
            <div className="popup">
                <div className="popup-inner champ_height_popup">
                    <div>
                        <button className="close-btn" onClick={() => {props.changeTrigger(false)}}>close</button>
                    </div>
                    <div>
                        {props.children}
                    </div>
                </div>
            </div>
        );
    }else{
        return "";
    }
}

export default Popup;