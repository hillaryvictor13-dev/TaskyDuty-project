import { Outlet } from "react-router"


export default function AuthLayout() {
  return (
    <div className="container mx-auto py-8 px-4 flex justify-center items-center min-h-screen">
<div className="w-full max-w-md mx-auto">

        <img src="./Group 2.png" alt="logo" />
<Outlet />
</div>
    </div>
  )
}
