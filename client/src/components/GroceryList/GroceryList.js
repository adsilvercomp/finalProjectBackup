import React from "react";
import "./GroceryList.css";

class GroceryList extends React.Component {

    render(){
        return(
            <div className="list-overflow-container subContainer">
                <ul className="list-group">
                    {this.props.children}
                </ul>
            </div>
        )
    }
}

export default GroceryList;