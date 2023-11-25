import React,{ useRef, useState } from 'react'
import "./style.scss"
import { QuestionHelp, Slider } from "../../components" 
import { useAuth } from '../../contexts'
import axiosInstance from '../../helpers'

const SignupCard = ({ toggleSwitch, focusStyle, setToggleSwitch,changeState }) => {

    const [signupForm, setSignupForm] = useState({
        username:"",
        email:"",
        password:"",
        confPassword:""
    })

    const { width } = useAuth()

    const passwordRef = useRef()
    const confPasswordRef = useRef()

    const activeStyle = {
        "outline": "1px solid var(--bg)",
        "color": "var(--bg)",
        "backgroundColor":"var(--bg)"
    }

    const showLight = {
        "display":"block"
    }

    const lampShade = {
        "filter": "brightness(1)"
    }

    function handleInput(e){
        setSignupForm(prev => ({...prev, [e.target.name]: e.target.value}))
    }

    function clearInput(){
        setSignupForm({
            username:"",
            email:"",
            password:"",
            confPassword:""
        })
    }

    function verifyPassword(){

        const password = signupForm.password
        const confPassword = signupForm.confPassword

        let equal = false
        let numbers = false
        let specialCharacter = false
        let capital = false

        if(password == confPassword){
            equal = true
        }
        if(/\d/.test(password) == true){
            numbers = true
        }
        if(/[!-\/:-@[-`{-~]/.test(password) == true){
            specialCharacter = true
        }
        if(/[A-Z]/.test(password) == true){
            capital = true
        }
        if(equal && numbers && specialCharacter && capital){
            clearInput()
            return true
        }
    }

    const sendRegisterRequest = async (e) => {
        e.preventDefault()

        console.log(signupForm);

        const confirm = verifyPassword()

        if(confirm){

            const data = {
                username:signupForm.username,
                email:signupForm.email,
                password:signupForm.password
            }

            const resp = await axiosInstance.post("/auth/register",data)

            if(resp.status === 201){
                setToggleSwitch(!toggleSwitch)
            }else{
                alert("Failed to register")
            }
        }
    }

  return (
    <div id='signup' className={width <= 850 && toggleSwitch ? "card show" : width <= 850 && !toggleSwitch ? "card hide" : "card" } style={Object.assign(toggleSwitch ? focusStyle : {"color":"var(--bg)"})}>
        {
            width <= 850 
            ? <Slider changeState={changeState} />
            : ""
        }
       
        <div className="lamp">
            <img src="https://res.cloudinary.com/de2nposrf/image/upload/v1697042277/static/lamp.png" alt="lamp" id='right-lamp' style={toggleSwitch ? lampShade : {}}/>
            <div id="rlight" style={toggleSwitch ? showLight : {}}></div>
        </div>
        {toggleSwitch ? <QuestionHelp active={toggleSwitch} title={"Signing Up"} content={
        <>
        Not sure how to register? In each box enter the required content.<br /><br />
        Make sure your passwords contain at least one:<br/>
            <ul>
                <li>Uppercase Letter</li>
                <li>Digit</li>
                <li>Special Character .,*&^!"</li>
            </ul>
            </>
            }
            orientation={"left"}/>
        : ""}
        <header>
            <h2>Register</h2>
        </header>
        <form onSubmit={sendRegisterRequest} data-testid="signup-form">
            <label htmlFor="username">Username</label>
            <input data-testid={"user-input"} type="text" className={"signup-input"} name="username" id="reg-user-input" value={signupForm.username} placeholder='>' onChange={handleInput} autoComplete='off' disabled={!toggleSwitch}  style={!toggleSwitch ? activeStyle : {}} required/>

            <label htmlFor="email">Email</label>
            <input data-testid={"email-input"} type="email" className={"signup-input"} name="email" id="email-input" value={signupForm.email} placeholder='>' onChange={handleInput} autoComplete='off' disabled={!toggleSwitch}  style={!toggleSwitch ? activeStyle : {}} required/>

            <label htmlFor="password">Password</label>
            <input data-testid={"password-input"} ref={passwordRef} className={"signup-input"} type="password" name="password" id="reg-password-input" value={signupForm.password} placeholder='>' onChange={handleInput} autoComplete='off' disabled={!toggleSwitch}  style={!toggleSwitch ? activeStyle : {}} required/>

            <label htmlFor="confpassword">Confirm Password</label>
            <input data-testid={"confpassword-input"} ref={confPasswordRef} className={"signup-input"} type="password" name="confPassword" id="conf-password-input" value={signupForm.confPassword} placeholder='>' onChange={handleInput} autoComplete='off' disabled={!toggleSwitch}  style={!toggleSwitch ? activeStyle : {}} required/>

            <button type="submit" id='register-btn' disabled={!toggleSwitch}  style={!toggleSwitch ? activeStyle : {}}>Join</button>
        </form>
    </div>
  )
}

export default SignupCard
