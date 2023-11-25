import React,{ useState, useMemo, useContext } from 'react'
import "./style.scss"
import { useAuth } from "../../contexts"
import { useNavigate } from 'react-router-dom'
import { QuestionHelp, Slider } from '../../components'
import axiosInstance from '../../helpers'

const LoginCard = ({ toggleSwitch,focusStyle,changeState }) => {

    const [loginForm, setLoginForm] = useState({
        username:"",
        password:""
    })

    const { setUser, setUsersUsername, width } = useAuth()

    const navigate = useNavigate()

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
        setLoginForm(prev => ({...prev, [e.target.name]: e.target.value}))
    }

    function clearInput(){
        setLoginForm({
            username:"",
            password:""
        })
    }

    const sendLoginRequest = async (e) => {

        e.preventDefault()

        try{
            const resp = await axiosInstance.post(`/auth/login`,loginForm)

            if(resp.status == 204){
                setUser(loginForm.username)

                try {
                    const resp2 = await axiosInstance.get(`/users/name/${loginForm.username}`)

                    const data = await resp2.data
                    setUser(data.data.id)
                    setUsersUsername(data.data.username)
                    clearInput()
                    navigate("/")
                    
                } catch (err) {
                    console.log(err)
                }

            }else{
                alert("You messed up.")
            }
        }catch(err){
            console.log("Error logging in. ",err)
        }

    }

  return (
    <div id="login"  className={width <= 850 && !toggleSwitch ? "card show" : width <= 850 && toggleSwitch ? "card hide" : "card" } style={Object.assign(!toggleSwitch ? focusStyle : {"color":"var(--bg)"})} >

        {
            width <= 850 
            ? <Slider changeState={changeState} left={true}/>
            : ""
        }

        <div className="lamp">
            <img src="https://res.cloudinary.com/de2nposrf/image/upload/v1697042277/static/lamp.png" alt="lamp" id='left-lamp' style={!toggleSwitch ? lampShade : {}}/>
            <div id="llight" style={!toggleSwitch ? showLight : {}}></div>
        </div>
        { !toggleSwitch ? <QuestionHelp active={toggleSwitch} title={"Logging In"} content={<p>Made an account? <br></br> Then please enter your username and password in the entries below.<br /><br />Haven't made one? Hit the switch!</p>}/> : "" }
        <header>
            <h2>Log In</h2>
            {/* <p>*placeholder text*</p> */}
        </header>
        <form data-testid={"login-form"} onSubmit={sendLoginRequest}>
            <label htmlFor="username">Username</label>
            <input data-testid={"user-input"} type="text" name="username" id="user-input" value={loginForm.username} placeholder='>' onChange={handleInput} autoComplete='false' disabled={toggleSwitch} style={toggleSwitch ? activeStyle : {}} required/>

            <label htmlFor="password">Password</label>
            <input data-testid={"password-input"} type="password" name="password" id="password-input" value={loginForm.password} placeholder='>' onChange={handleInput} autoComplete='false' disabled={toggleSwitch} style={toggleSwitch ? activeStyle : {}} required/>

            <button type='submit' id='signin-btn' disabled={toggleSwitch} style={toggleSwitch ? activeStyle : {}}>Sign In</button>
        </form>
    </div>
  )
}

export default LoginCard
