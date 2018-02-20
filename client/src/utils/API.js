import axios from "axios";

export default {
   // create a route for posting groceries to database
   saveGroceries: function (groceryItem){
       
       return axios.post("/api/groceries", groceryItem);
   },

   //create a route for getting groceries from database
   getGroceries: function(){
       
       return axios.get("/api/groceries");
   },

   //create a route for deleting groceries from database
   deleteGroceries: function(id){
      
       return axios.delete("/api/groceries" + id);
   },
   
   //this route will update whether a grocery item is purchased
   updateGroceries: function(id, update){
       
       return axios.patch("/api/groceries" + id, update );
   },

   //this route will update whether a food item has been selected to be used in recipe
   useGroceries: function(id, update){
       
       return axios.patch("/api/useGroceries" + id, update );
   },

   //create a route for making call to api - plugging in food items
   getRecipes: function(groceryItem){
       
       return axios.get("/api/recipes", {params: groceryItem});
   }


};