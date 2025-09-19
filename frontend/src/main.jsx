import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import {createBrowserRouter, RouterProvider} from "react-router-dom"
import Home from './pages/Home.jsx'
import Recipes from './pages/Recipes.jsx'
import Authentication from './pages/Authentication.jsx'
import Profile from './pages/Profile.jsx'

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home></Home>
  },
  {
    path: "/ricette",
    element: <Recipes></Recipes>
  },
  {
    path: "/login",
    element: <Authentication></Authentication>
  },
  {
    path: "/profile",
    element: <Profile></Profile>
  }
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router}/>
  </StrictMode>,
)
