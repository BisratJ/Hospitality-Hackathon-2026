import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import AboutUs from './pages/AboutUs'
import Resources from './pages/Resources'
import Registration from './pages/Registration'
import ContactUs from './pages/ContactUs'
import CheckIn from './pages/CheckIn'
import PastEvents from './pages/PastEvents'
import FAQ from './pages/FAQ'
import Gallery from './pages/Gallery'
import Navbar from './layouts/Navbar'
import Footer from './layouts/Footer'

function App() {
  return (
    <div className='bg-white'>
      <Router>
        <Navbar />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/about-us' element={<AboutUs />} />
          <Route path='/resources' element={<Resources />} />
          <Route path='/registration' element={<Registration />} />
          <Route path='/contact-us' element={<ContactUs />} />
          <Route path='/check-in' element={<CheckIn />} />
          <Route path='/checkin' element={<CheckIn />} />
          <Route path='/past-events' element={<PastEvents />} />
          <Route path='/faq' element={<FAQ />} />
          <Route path='/gallery' element={<Gallery />} />
        </Routes>
        <Footer />
      </Router>
    </div>
  )
}

export default App