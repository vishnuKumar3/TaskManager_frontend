import React,{useRef, useMemo, useState} from 'react';
import {Link, useNavigate} from "react-router-dom"
import { Formik } from 'formik';
import * as yup from "yup"
import {colors} from "../colour_config"
import {makeStyles} from "@mui/styles"
import {Button} from "@mui/material"
import axios from "axios"
import {message} from "antd"
import { useGoogleLogin } from '@react-oauth/google';
import { useCookies } from 'react-cookie';
import { useDispatch } from 'react-redux';
import { setUser } from '../reducers/user';
import {LinearProgress} from "@mui/material"


const useStyles = makeStyles((theme)=>({
    input:{
        width:"100%",
        padding:"10px",
        fontSize:"15px",
        borderRadius:"5px",
        border:`1px solid ${colors.borderGrayColor}`
    },
    errorMessage:{
        color:"red",
        fontSize:"12px"
    }
}))

const LoginSchema = yup.object({
    email:yup.string().email().required("Please provide your email"),
    password:yup.string().required("Please provide your password")
})

export default function Login(){
    const styles = useStyles()
    const formRef = useRef("")
    const navigate = useNavigate();
    const [cookies, setCookie, removeCookie] = useCookies()
    const [messageApi, contextHolder] = message.useMessage()
    const [showProgress, setShowProgress] = useState(false);
    const dispatch = useDispatch();

    const googleLogin = useGoogleLogin({
        onSuccess: async(codeResponse)=>{
            console.log("google response...",codeResponse);
            let userData = await axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${codeResponse.access_token}`);
            console.log(userData)
            if(userData?.data?.email){
                let userInfo = {
                    email:userData?.data?.email
                }
                handleSignin(userInfo, "google")
            }
        },
        onError: (error) => {console.log('Login Failed:', error);messageApi.open({type:"error",content:error,duration:5})}
    });    

    const handleSignin = async (formValues, signInType)=>{
        setShowProgress(true)
        formValues["signInType"] = signInType
        let res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/user/login`,formValues,{
            headers:{
                "Content-Type":"application/json"
            }
        });
        if(res){
            setShowProgress(false)
        }
        if(res?.data?.status?.toLowerCase() === "success"){
            if(res?.data?.token){
                let dateObj = new Date();
                dateObj.setTime(dateObj.getTime()+(24*60*60*1000))
                setCookie("accessToken",res?.data?.token,{expires:dateObj})
            }
            dispatch(setUser(res?.data?.userData));
            messageApi.open({content:res?.data?.message,type:"success",duration:5})
            navigate("/tasks",{replace:true})
        }
        else{
            messageApi.open({content:res?.data?.message,type:"error",duration:5})
        }
        console.log("response from signup api",res.data);
    }
    
    return(
        <div style={{display:"flex",justifyContent:"center",alignItems:"center",width:"100%",height:"100vh",background:`linear-gradient(340deg,${colors.blueVariant} 50%,white 1%`}}>
            {contextHolder}
            <Formik
            initialValues={{ email: '', password: '' }}
            validationSchema={LoginSchema}
            onSubmit={(values, { setSubmitting,resetForm }) => {
                console.log(values)
                handleSignin(values,"normal")
                resetForm()
            }}
            >
            {(formik) => (
                <form ref={formRef} style={{background:"white",width:"350px",rowGap:"10px",border:"1px solid #aaaaaa99",borderRadius:"10px",display:"flex",flexDirection:"column",padding:"30px 30px 50px 30px"}} onSubmit={formik.handleSubmit}>
                {showProgress && <LinearProgress />}                    
                <p style={{fontSize:"30px",fontWeight:"600",padding:"0px 0px 20px 0px"}}>Login</p>    
                <input
                    className={`${styles.input}`}
                    type="text"
                    name="email"
                    placeholder="email"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.email}
                />
                {formik.touched.email && formik.errors.email?<p className={`${styles.errorMessage}`}>{formik.errors.email}</p>:""}
                <input
                    className={`${styles.input}`}
                    type="password"
                    name="password"
                    placeholder="password"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.password}
                />
                <p className={`${styles.errorMessage}`}>{formik.touched.password && formik.errors.password?formik.errors.password:""}</p>
                <div style={{display:"flex",justifyContent:"center"}}>
                    <Button variant={"contained"} type='submit' style={{textTransform:"capitalize",padding:"5px 20px",background:`${colors.blueVariant}`,color:"white"}} disabled={formik.isSubmitting}>
                        Submit
                    </Button>
                </div>
                <div style={{display:"flex",alignItems:'center',columnGap:"5px"}}>
                    <hr style={{flexGrow:1}}/>
                    or
                    <hr style={{flexGrow:1}}/>
                </div>
                <div style={{display:"flex",justifyContent:"center"}}>
                    <Button onClick={googleLogin} variant={"contained"} style={{textTransform:"capitalize",padding:"5px 20px",background:`${colors.blueVariant}`,color:"white"}} disabled={formik.isSubmitting}>
                        Signin with Google
                    </Button>
                </div>                
                <div style={{marginTop:"20px",display:"flex",rowGap:"5px",flexDirection:"column",alignItems:"center"}}>
                    <p style={{fontSize:"15px"}}>Don't have an account?</p>
                    <Link style={{fontSize:"15px"}} to="/register">Signup</Link>
                </div>
                </form>
            )}
            </Formik>
        </div>
    )
}