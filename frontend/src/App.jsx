import React from 'react'
import "./App.css"
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Home from './components/pages/Home'
import Login from './components/pages/Login'
import Blogs from './components/pages/Blogs'
import SingleBlog from './components/pages/SingleBlog'
import About from './components/pages/About'
import AllAuthors from './components/pages/AllAuthors'
import Dashboard from './components/pages/Dashboard'
import UpdateBlog from './components/pages/UpdateBlog'

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/register' element={<Login/>}/>
        <Route path='/blogs' element={<Blogs/>}/>
        <Route path='/blog/:id' element={<SingleBlog/>}/>
        <Route path='/about' element={<About/>}/>
        <Route path='/authors' element={<AllAuthors/>}/>
        <Route path='/dashboard' element={<Dashboard/>}/>
        <Route path='/blog.update.:id' element={<UpdateBlog/>}/>
      </Routes>
    </Router>
  )
}

export default App