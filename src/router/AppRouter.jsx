import {Routes, Route } from 'react-router-dom'; 
import Layout from "../pages/layout";
import Home from "../pages/Home/page";


export default function AppRouter() {
  return (
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
        
        
        </Route>
      </Routes>
  )
}
