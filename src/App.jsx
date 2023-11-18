import React,{ useState,useEffect,lazy,Suspense } from 'react'
import * as Pages from './pages';
// import { Login } from "./pages"
import { NavBar } from './layout'
import { Routes, Route } from "react-router-dom"
import "./App.css"
import { useAuth, useRoom } from './contexts';
import ProtectedRoute from './routes';

const Explore = lazy(() => import("./pages/Explore"))
const Category = lazy(() => import("./pages/SubRoom"))

// const Bedroom = lazy(() => import("./pages/Bedroom"))
// const Studio = lazy(() => import("./pages/Studio"))
// const Kitchen = lazy(() => import("./pages/Kitchen"))
// const Bathroom = lazy(() => import("./pages/Bathroom"))
// const Garden = lazy(() => import("./pages/Garden"))
// const Living = lazy(() => import("./pages/Living"))


export default function App() {

  const { user, setWidth } = useAuth()

  const handleRefresh = async () => {
    try {

    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    if(!user){
      handleRefresh()
    }
  },[user])

  useEffect(() => {
    function handleResize(){
      setWidth(window.innerWidth)
    }

    window.addEventListener("resize",handleResize)
    return () => window.removeEventListener("resize",handleResize)
  },[])

  return (
      <Suspense fallback={<h1>Loading</h1>}>
        <Routes>
          <Route path="/" element={<NavBar/>}>
            <Route index element={<Pages.Home/>}/>
            <Route path='Explore' element={<Explore/>}/>
            <Route path="category" element={<Category/>}/>
              {/* <Route path='bedroom' element={<Bedroom/>}/>
              <Route path='studio' element={<Studio/>}/>
              <Route path='kitchen' element={<Kitchen/>}/>
              <Route path='bathroom' element={<Bathroom/>}/>
              <Route path='garden' element={<Garden/>}/>
              <Route path='living' element={<Living/>}/> */}
            <Route path='Login' element={<Pages.Login />}/>
            <Route path='generate' element={<ProtectedRoute redirectTo="/Login"/>}>
              <Route index element={ <Pages.GenerateRoom /> }/>
            </Route>
            <Route path='*' element={<Pages.NotFound/>}/>
            <Route path='profile' element={<ProtectedRoute redirectTo="/Login" />}>
              <Route index element={<Pages.ProfilePage/>} />
            </Route>
          </Route>
        </Routes>
      </Suspense>

  )
}
