import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Main from "./sections/Main";


const App = () => (
    <Router>
      <div>
        {/* <Navbar /> */}
        <Route exact path="/" component={Main} />
      </div>
    </Router>
  )
  
  
  
  export default App;