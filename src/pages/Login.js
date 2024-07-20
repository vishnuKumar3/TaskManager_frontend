import React,{useRef} from 'react';
import {Link} from "react-router-dom"
import { Formik } from 'formik';
import * as yup from "yup"
import {colors} from "../colour_config"
import {makeStyles} from "@mui/styles"
import {Button} from "@mui/material"

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
    return(
        <div style={{display:"flex",justifyContent:"center",alignItems:"center",width:"100%",height:"100vh",background:`linear-gradient(340deg,${colors.blueVariant} 50%,white 1%`}}>
            <Formik
            initialValues={{ email: '', password: '' }}
            validationSchema={LoginSchema}
            onSubmit={(values, { setSubmitting }) => {
                console.log(values)
            }}
            >
            {(formik) => (
                <form ref={formRef} style={{background:"white",width:"350px",rowGap:"10px",border:"1px solid #aaaaaa99",borderRadius:"10px",display:"flex",flexDirection:"column",padding:"30px 30px 50px 30px"}} onSubmit={formik.handleSubmit}>
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
                    <Button variant={"contained"} type='submit' style={{padding:"5px 20px",background:`${colors.blueVariant}`,color:"white"}} disabled={formik.isSubmitting}>
                        Submit
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