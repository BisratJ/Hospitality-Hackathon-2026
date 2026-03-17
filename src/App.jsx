import React, { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import Home from './pages/Home'
import AboutUs from './pages/AboutUs'
import Resources from './pages/Resources'
import Registration from './pages/Registration'
import ContactUs from './pages/ContactUs'
import CheckIn from './pages/CheckIn'
import PastEvents from './pages/PastEvents'
import FAQ from './pages/FAQ'
import Gallery from './pages/Gallery'
import AdminLogin from './pages/AdminLogin'
import AdminDashboard from './pages/AdminDashboard'
import Navbar from './layouts/Navbar'
import Footer from './layouts/Footer'

// Scroll to top on every route change
function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
  }, [pathname])
  return null
}

function Layout({ children }) {
  const location = useLocation()
  const isAdmin = location.pathname.startsWith('/admin')
  return (
    <>
      {!isAdmin && <Navbar />}
      {children}
      {!isAdmin && <Footer />}
    </>
  )
}

function App() {
  return (
    <div className='bg-white'>
      <Router>
        <ScrollToTop />
        <Layout>
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
            <Route path='/admin' element={<AdminLogin />} />
            <Route path='/admin/dashboard' element={<AdminDashboard />} />
          </Routes>
        </Layout>
      </Router>
    </div>
  )
}

export default App