import './App.css'
import {
  createBrowserRouter,
  RouterProvider,
  Route,
  Link,
} from "react-router-dom";
import NavBar from "./components/NavBar"
import Footer from "./components/Footer"

import Home from "./pages/Home"
import Login from "./pages/Login"


var userID = window.localStorage.getItem("userID")
var teamSpaceID = window.localStorage.getItem("teamSpaceID")


const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
    loader: () => (!userID ? window.location.href = '/login' : null),
  },
  {
    path: "/login",
    element: <Login />,
    loader: () => (userID ? window.location.href = '/' : null),
  },
])

function App() {
  return (
    <div className="App">
      <NavBar />
      <RouterProvider router={router} />
      <Footer />
    </div>
  )
}

export default App
