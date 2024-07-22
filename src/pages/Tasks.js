import TaskComponent from "../components/TaskComponent"
import DNDNewComponent from "../components/DNDComponent/DNDNewComponent"
import { useEffect } from "react"
import { useCookies } from "react-cookie"
import { useNavigate } from "react-router-dom"

export default function Tasks(){
    const [cookies, setCookie, removeCookie] = useCookies()
    const navigate = useNavigate()

    useEffect(()=>{
        if(cookies?.accessToken){
            //nothing to do
        }
        else{
            navigate("/login")
        }
    },[])

    return(
        <div style={{width:"100%",display:"flex",rowGap:"10px"}}>
            <DNDNewComponent/>                         
        </div>
        
    )
}