import React,{ useState,useEffect,lazy,Suspense } from 'react'
import * as Pages from './pages';
import { NavBar } from './layout'
import { Routes, Route } from "react-router-dom"
import "./App.scss"
import { useAuth } from './contexts';
import ProtectedRoute from './routes';
import { Loading } from './components';

const Explore = lazy(() => import("./pages/Explore"))
const Category = lazy(() => import("./pages/SubRoom"))

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
    window.scrollTo(0, 0);
    function handleResize(){
      setWidth(window.innerWidth)
    }

    window.addEventListener("resize",handleResize)
    return () => window.removeEventListener("resize",handleResize)
  },[])

  return (
      <Suspense fallback={<Loading /> }>
        <Routes>
          <Route path="/" element={<NavBar/>}>
            <Route index element={<Pages.Home/>}/>
            <Route path='Explore' element={<Explore/>}/>
            <Route path="category" element={<Category/>}/>
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
