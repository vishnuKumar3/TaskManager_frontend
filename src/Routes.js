import {useRoutes} from "react-router-dom"
import Tasks from "./pages/Tasks"
import App from "./App"
import QuoteApp from "./components/DNDComponent/DNDNewComponent"
import Login from "./pages/Login"
import Signup from "./pages/Signup"

export default function Routes(){
    return useRoutes([{
            path:"/tasks",
            element:<Tasks/>
        },
        {
            path:"/",
            element:<App/>            
        },
        {
            path:"quote",
            element:<QuoteApp/>
        },
        {
            path:"login",
            element:<Login/>
        },
        {
            path:'register',
            element:<Signup/>
        }
    ])
}