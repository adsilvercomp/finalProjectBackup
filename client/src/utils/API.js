import axios from "axios";

export default {
   // create a route for posting groceries to database
   saveGroceries: function (groceryItem){
       console.log("the save grocery route has been hit " + groceryItem.food);
       console.log(groceryItem)
       return axios.post("/api/groceries", groceryItem);
   },

   //create a route for getting groceries from database
   getGroceries: function(){
       console.log("the get grocery route has been hit");
       return axios.get("/api/groceries");
   },

   //create a route for deleting groceries from database
   deleteGroceries: function(id){
       console.log("the delete grocery route has been hit" + id);
       return axios.delete("/api/groceries" + id);
   },
   
   //create a route for updating the groceries
   updateGroceries: function(id, update){
       console.log({update});
       console.log("this route will update " + id + " with " + update.purchased);
       return axios.patch("/api/groceries" + id, update );
   },

   useGroceries: function(id, update){
       console.log({update});
       console.log("this route will update " + id + " with " + update.use);
       return axios.patch("/api/useGroceries" + id, update );
   },

   //create a route for making call to api - plugging in food items
   getRecipes: function(groceryItem){
       console.log("API food "+ groceryItem);
       console.log("the get recipe route has been hit" + groceryItem);
       return axios.get("/api/recipes", {params: groceryItem});
   }


};