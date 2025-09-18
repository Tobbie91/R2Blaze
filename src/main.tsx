import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'
import App from './App'
import Home from './pages/Home'
import Products from './pages/Products'
import Product from './pages/Product'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import About from './pages/About'
import Policies from './pages/Policies'
import AdminLogin from './pages/AdminLogin'
import AdminPage from './pages/AdminPage'
import OrderConfirmation from './pages/order'
import AdminProducts from './pages/AdminProducts'
import RequireAdmin from './components/RequireAdmin'
import { AuthProvider } from './components/AuthProvider'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <Home /> },
      { path: 'products', element: <Products /> },
      // { path: 'products/:id/:slug', element: <Product /> },  
      { path: 'products/:id', element: <Product /> }, 
      { path: 'cart', element: <Cart /> },
      { path: 'checkout', element: <Checkout /> },
      { path: 'about', element: <About /> },
      { path: 'policies', element: <Policies /> },
      {path:"login", element: <AdminLogin />} ,
      { path: 'admin', element: <RequireAdmin><AdminPage /></RequireAdmin> },
      { path: 'admin/products', element: <RequireAdmin><AdminProducts /></RequireAdmin> },
      {path:"order-confirmation", element: <OrderConfirmation />} ,
    //  {path: "admins", element:<AdminPage />} 
    ],
  },
])

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>
)
