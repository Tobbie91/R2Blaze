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
      { path: 'admin', element: <AdminPage /> },
      {path:"login", element: <AdminLogin />} ,
      {path:"order-confirmation", element: <OrderConfirmation />} ,
    //  {path: "admins", element:<AdminPage />} 
    ],
  },
])

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
)
