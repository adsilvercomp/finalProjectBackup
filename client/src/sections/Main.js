import React from "react";
import API from "../utils/API";
import { GroceryList, GroceryItem } from "../components/GroceryList";
import { Recipes, IndividualRecipes } from "../components/Recipes";


class Main extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            //groceries holds all of the saved groceries and is updated by the save groceries function
            groceries: [],

            //apiParams are the food search parameters you are plugging into the api, they are being sent from the getGroceries read function to the getRecipes function.
            apiParams: [],

            //recipex is the array that contains the api response data, which is then being mapped over in the jsx and sent to the view.
            recipex: [],

            //this is being updated when the user types in the food input and is passed to the database on submit
            foodItem: "",

            //purchased is set as a default to false in the database, when the user clicks on the purchased button, it triggers an event, which passes the item's id to the purchaseGroceries function, which update purchased to true. The JSX will render differently depending on whether purchased is true or false and the api should not make a call unless purchase and use are true.
            purchased: false,

            //Use is also set as a default in the db to false. It toggled by the useGroceries function, which can only be can only be clicked if an item is purchased. If clicked by the user, the event will call the useGroceries function which updates/ toggle use in the database.
            use: false,

            //This boolean is used to display no recipe response
            zeroRecipes: false,

            //when this is set to true, the loading spinner will be activated.
            loading: false

        };
    }


    //when the page loads the getGroceries function is called
    componentDidMount() {
        this.getGroceries();
    }

    //this function retrieves groceries from the database, loops through them, pushes them to an array and then updates the states of groceries with that array.

    getGroceries = () => {
        API.getGroceries()
            .then(res => {
                let savedItems = []
                for (let i = 0; i < res.data.length; i++) {
                    savedItems.push(res.data[i])
                }
                this.setState({ groceries: savedItems })

            })
            .then(() => this.getRecipes(this.state.groceries))

    }

    deleteGroceries = (item) => {
        API.deleteGroceries(item)
            .then(() => this.getGroceries())
            .catch(err => console.log(err));
    }

    purchaseGroceries = (id) => {
        API.updateGroceries(id, { purchased: true })
            .then((res) => console.log(res))
            .then(() => this.getGroceries())
    }

    useGroceries = (id) => {
        if (this.state.use === false) {
            this.setState({ use: true })
            API.useGroceries(id, { use: true })
                .then((res) => console.log(res))
                .then(() => this.getGroceries())
        } else {
            this.setState({ use: false })
            API.useGroceries(id, { use: false })
                .then((res) => console.log(res))
                .then(() => this.getGroceries())
        }
    }


    handleChange = (event) => {
        const target = event.target;
        const value = target.value
        const name = target.name;

        this.setState({
            [name]: value
        });
    }

    saveGroceries = (event) => {
        event.preventDefault();

        API.saveGroceries({
            user: this.state.currentUser,
            food: this.state.foodItem,
            purchased: false
        })

            .then(() => this.getGroceries())
            .then(this.setState({ foodItem: "" }))
            .catch(err => console.log("Save error:" + err))

        // console.log("the handlesubmit button has been hit " + this.state.foodItem)
    }


    getRecipes = (groceries) => {
        let array = []

        //map over the grocery list, if the item has been purchased and the user would like to get recipes using the item, push it into array
        array = this.state.groceries.map(item => {
            if (item.use === true && item.purchased === true) {
                return item.food;
            } else {
                return [];
            }

        })
        //call the getRecipes2 function and pass the gorceries items that the user would like to use in their recipe.
        this.getRecipes2(array);

    }

    getRecipes2 = (array) => {
        const context = this;
        //set the state of apiParams to the array of groceries that the user would like to use in their recipe
        this.setState({ apiParams: array })

        //if the length of the paramters is greater than zero set the state of loading to true
        if (this.state.apiParams.length > 0) {

            this.setState({ loading: true })
            API.getRecipes({
                food: this.state.apiParams
            })
                .then(function (data) {
                    //when that api returns data, set the state of loading to false
                    context.setState({ loading: false })

                    //if there is api data, and the user is querying recipes loop through the recipes and push them into an array called apiData, then set the state of recipex to the apiData
                    if (data.data.length > 0 && context.state.apiParams.length > 0) {

                        let apiData = []
                        for (let i = 0; i < data.data.length; i++) {
                            apiData.push(data.data[i].recipe)
                        }

                        context.setState({ recipex: apiData })
                        context.setState({ zeroRecipes: false })
                    }


                    //if the user is not querying recipes or no recipes are returned based on user's query call the noRecipes function.
                    else if (context.state.apiParams.length === 0 || data.data.length === 0) {

                        context.noRecipes();
                    }
                })
                .catch(function (err) {
                    console.log(err);
                })
        } else {
            this.setState({ recipex: [] })
        }

    }


    noRecipes = () => {
        this.setState({ zeroRecipes: true })
    }




    render() {
        return (
            <div>
                <div id="searchContainer" className="container">
                    <div className="row" >
                        <img className="logoImage" src={require("../images/Logo2.png")} />
                    </div>
                    <form onSubmit={this.saveGroceries}>
                        <label htmlFor="enterFoodItem">
                            <h3>Add Food to Grocery List</h3>
                            <input className="inputField foodInput" name="foodItem" type="text" value={this.state.foodItem} onChange={this.handleChange} />

                            <input className="button" type="submit" value="Submit" />
                        </label>
                    </form>
                </div>

                <div id="responseContainer" className="container">

                    <div className="grocerySection  col-lg-6 col-md-6 col-sm-6">
                        <h4 className="sectionTitle subtitle">Grocery List</h4>
                        <br />
                        <GroceryList>
                            {this.state.groceries.map(item => {
                                if (item.purchased === true && item.use === false) {
                                    return (
                                        <GroceryItem>
                                            <strong>
                                                <strike> {item.food}</strike>
                                                <br />

                                            </strong>
                                            <button className="button listButton"
                                                onClick={() => this.useGroceries(item._id)}
                                            >Get Recipes
                                    </button>
                                            <button className="button listButton"
                                                onClick={() => this.deleteGroceries(item._id)}
                                            >Delete
                                    </button>


                                        </GroceryItem>
                                    );
                                } else if (item.purchased === true && item.use === true) {
                                    return (
                                        <GroceryItem>
                                            <strong>
                                                <strike> {item.food}</strike>
                                                <h4> ✓</h4>
                                                <br />
                                            </strong>
                                            <button className="button listButton"
                                                onClick={() => this.useGroceries(item._id)}
                                            >Remove from Recipe
                                    </button>

                                            <button className="button"
                                                onClick={() => this.deleteGroceries(item._id)}
                                            >Delete
                                    </button>

                                        </GroceryItem>
                                    );
                                }
                                else {
                                    return (
                                        <GroceryItem>
                                            <strong>
                                                {"Item: " + item.food}
                                                <br />

                                            </strong>
                                            <button className="button listButton"
                                                onClick={() => this.purchaseGroceries(item._id)}
                                            >Purchased
                                    </button>
                                            <button className="button listButton"
                                                onClick={() => this.deleteGroceries(item._id)}
                                            >Delete
                                    </button>
                                        </GroceryItem>
                                    );
                                }
                            })}

                        </GroceryList>
                    </div>

                    <div className="recipeSection col-lg-6 col-md-6 col-sm-6">

                        <h4 className="sectionTitle title">Recipes</h4>
                        <br />
                        <Recipes>

                            {this.state.loading === true ?
                                <IndividualRecipes >
                                    <div>
                                        <img alt="" id="loadSpinner" src={require("../images/logo.png")} />
                                    </div>
                                </IndividualRecipes>
                                :
                                this.state.zeroRecipes === true ?
                                    <IndividualRecipes >
                                        <div>
                                            <h4>No recipes to display</h4>
                                        </div>
                                    </IndividualRecipes>
                                    :
                                    this.state.recipex.map(recipe => {
                                        return (
                                            <IndividualRecipes>
                                                <strong>
                                                    {recipe.label}
                                                </strong>
                                                <br />
                                                <br />
                                                <div className="recipeImage center-block">
                                                    <a href={recipe.shareAs}> <img id="image1" src={recipe.image} /> </a>
                                                </div>
                                                <br />
                                                <div>
                                                    {recipe.ingredientLines}
                                                </div>

                                            </IndividualRecipes>
                                        )
                                    })
                            }

                        </Recipes>
                    </div>

                </div>


            </div>
        )
    }
}

export default Main;