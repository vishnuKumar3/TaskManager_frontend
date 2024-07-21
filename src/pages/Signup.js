import React,{useRef, useState} from 'react';
import {Link} from "react-router-dom"
import { Formik } from 'formik';
import * as yup from "yup"
import {colors} from "../colour_config"
import {makeStyles} from "@mui/styles"
import {Button} from "@mui/material"
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import axios from "axios"
import {message} from "antd"
import { useGoogleLogin } from '@react-oauth/google';
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
    firstName:yup.string().required("Please provide first name"),
    email:yup.string().email().required("Please provide your email"),
    password:yup.string().required("Please provide your password"),
    reEnteredPassword:yup.string().required("Please re enter password")
})

export default function Signup(){
    const styles = useStyles()
    const formRef = useRef("") 
    const [fileName, setFilename] = useState("");
    const [fileObj, setFileObj] = useState({})
    const [messageApi, contextHolder] = message.useMessage()
    const [showProgress, setShowProgress] = useState(false);

    const googleLogin = useGoogleLogin({
        onSuccess: async(codeResponse)=>{
            console.log("google response...",codeResponse);
            let userData = await axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${codeResponse.access_token}`);
            console.log(userData)
            if(userData?.data?.email){
                let userInfo = {
                    email:userData?.data?.email,
                    firstName:userData?.data?.given_name,
                    password:"google-signin",
                    lastName:userData?.data?.family_name,
                    avatarInfo:{
                        Location:userData?.data?.picture
                    }
                }
                setFileObj({})
                handleGoogleSignup(userInfo, "google")
            }
        },
        onError: (error) => {console.log('Login Failed:', error);messageApi.open({type:"error",content:error,duration:5})}
    });     

    const handleChange = (event)=>{
        console.log("file info",event.target.files)
        const maxSize = 2 * 1024 * 1024; 
        if (event.target.files && event.target.files[0].size > maxSize) {
            messageApi.open({content:"File size exceeds 2 MB",type:"warning",duration:5});
            event.target.value = "";
        }else if(event.target.files && !(event.target.files[0].type.includes("image"))){ 
            messageApi.open({content:"Please upload files of type image only",type:"warning",duration:5});
        }       
        else{
            let files = event.target.files;
            setFilename(files?.[0]?.name || "");
            setFileObj(files?.[0] || {})
        }
    }

    const handleGoogleSignup = async (formValues, signInType)=>{
        setShowProgress(true)
        formValues["signInType"] ="google";
        let res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/user/signup`,formValues,{
            headers:{
                "Content-Type":"application/json",
            }
        });
        if(res){
            setShowProgress(false);
        }
        if(res?.data?.status?.toLowerCase() === "success"){
            messageApi.open({content:res?.data?.message,type:"success",duration:5})
        }
        else{
            messageApi.open({content:res?.data?.message,type:"error",duration:5})
        }        
    }

    const handleFormData = async (formValues, signInType)=>{
        setShowProgress(true)
        let formData = new FormData();
        Object.entries(formValues).map(([key,value])=>{
            formData.append(key,value);
        })
        if(fileObj){
            formData.append("avatar",fileObj);
        }
        formData.append("signInType","normal");
        let res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/user/signup`,formData,{
            headers:{
            }
        });
        if(res){
            setFileObj({})            
            setShowProgress(false)
        }
        if(res?.data?.status?.toLowerCase() === "success"){
            messageApi.open({content:res?.data?.message,type:"success",duration:5})
        }
        else{
            messageApi.open({content:res?.data?.message,type:"error",duration:5})
        }        
        console.log("response from signup api",res.data);
    }  

    return(
        <div style={{display:"flex",justifyContent:"center",alignItems:"center",width:"100%",background:`linear-gradient(340deg,${colors.blueVariant} 50%,white 1%`,height:"max-content",padding:"50px 0px"}}>
            {contextHolder}
            <Formik
            initialValues={{ firstName:"",lastName:"",email: '', password: '',reEnteredPassword:"",avatar:"" }}
            validationSchema={LoginSchema}
            onSubmit={(values, { setSubmitting,resetForm }) => {
                console.log(values,fileObj)
                handleFormData(values, "normal")
                resetForm()
                setFilename("")
            }}
            >
            {(formik) => (
                <form ref={formRef} style={{background:"white",width:"350px",rowGap:"15px",border:"1px solid #aaaaaa99",borderRadius:"10px",display:"flex",flexDirection:"column",padding:"30px 30px 50px 30px"}} onSubmit={formik.handleSubmit}>
                {showProgress && <LinearProgress/>}                    
                <p style={{fontSize:"30px",fontWeight:"600",padding:"0px 0px 20px 0px"}}>Signup</p>    
                <input
                    className={`${styles.input}`}
                    type="text"
                    name="firstName"
                    placeholder="Firstname*"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.firstName}
                />
                {formik.touched.firstName && formik.errors.firstName?<p className={`${styles.errorMessage}`}>{formik.errors.firstName}</p>:""}
                <input
                    className={`${styles.input}`}
                    type="text"
                    name="lastName"
                    placeholder="Lastname"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.lastName}
                /> 
                <label htmlFor="file-upload" style={{cursor:"pointer",display:"flex",alignItems:"center",columnGap:"5px"}}>Upload Avatar <CloudUploadIcon/></label>
                <input type="file" accept='image/*' name="avatar" style={{position:"absolute",zIndex:-1,opacity:0}} onChange={handleChange} id="file-upload"/>
                {fileName && <p style={{fontSize:"12px",color:"lime"}}>{fileName}</p>}
                {!fileName && <p style={{fontSize:"12px",color:"red"}}>Only image files within 2MB are accepted</p>}
                 <input
                    className={`${styles.input}`}
                    type="text"
                    name="email"
                    placeholder="email*"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.email}
                />
                {formik.touched.email && formik.errors.email?<p className={`${styles.errorMessage}`}>{formik.errors.email}</p>:""}
                <input
                    className={`${styles.input}`}
                    type="password"
                    name="password"
                    placeholder="password*"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.password}
                />
                {formik.touched.password && formik.errors.password?<p className={`${styles.errorMessage}`}>{formik.errors.password}</p>:""}
                <input
                    className={`${styles.input}`}
                    type="password"
                    name="reEnteredPassword"
                    placeholder="re-enter password*"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.reEnteredPassword}
                />
                {formik.touched.reEnteredPassword && formik.errors.reEnteredPassword?<p className={`${styles.errorMessage}`}>{formik.errors.reEnteredPassword}</p>:""}                
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
                        Signup with Google
                    </Button>
                </div>                  
                <div style={{marginTop:"20px",display:"flex",rowGap:"5px",flexDirection:"column",alignItems:"center"}}>
                    <p style={{fontSize:"15px"}}>Already have an account?</p>
                    <Link style={{fontSize:"15px"}} to="/login">Login</Link>
                </div>
                </form>
            )}
            </Formik>
        </div>
    )
}