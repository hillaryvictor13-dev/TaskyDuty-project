import { Outlet } from 'react-router'
import Navbar from '../componets/Navbar'

export default function RootLayout() {
  return (
    <>
        <Navbar/>
        <Outlet/>
    </>
  )
}
