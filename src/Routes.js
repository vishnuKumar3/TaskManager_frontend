import {useRoutes} from "react-router-dom"
import Tasks from "./pages/Tasks"
import App from "./App"
import DNDNewComponent from "./components/DNDComponent/DNDNewComponent"
import Login from "./pages/Login"
import Signup from "./pages/Signup"
import HeaderComponent from "./components/HeaderComponent"

export default function Routes(){
    return useRoutes([{
            path:"/tasks",
            element:<HeaderComponent/>,
            children:[
                {
                    path:"/tasks",
                    element:<Tasks/>
                }
            ]
        },
        {
            path:"/",
            element:<Login/>            
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