import React from "react";
import "./Recipes.css";

class IndividualRecipes extends React.Component {
    render() {
        return (
            <li className="list-group-item itemFont subContainer">
                {this.props.children}
            </li>
        )
    }
}

export default IndividualRecipes;