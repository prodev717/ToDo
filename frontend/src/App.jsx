import Signup from "./signup";
import Login from "./login";
import Tasks from "./tasks";
import { BrowserRouter,Routes,Route,Navigate } from "react-router-dom";

function App(){
  return(
  <BrowserRouter>
    <Routes>
      <Route path="/signup" element={<Signup />}/>
      <Route path="/login" element={<Login />}/>
      <Route path="/tasks" element={<Tasks />}/>
      <Route path="*" element={<Navigate to="/login"/>}/>
    </Routes>
  </BrowserRouter>
  );
}

export default App;