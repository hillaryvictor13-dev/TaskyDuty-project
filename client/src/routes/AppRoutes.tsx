import { createBrowserRouter, RouterProvider } from "react-router";
import RootLayout from "../layouts/RootLayout";
// import AuthLayout from "../layouts/AuthLayout";
import Home from "../pages/home/Home";
import MyTasks from "../pages/my-tasks/MyTasks";
import NewTask from "../pages/new-task/NewTask";
import EditTask from "../pages/edit-task/EditTask";
import Login from "../pages/login/Login";
import Register from "../pages/register/Register";
import { PrivateRoutes, PublicRoutes } from "./RouteGuard";
import { useAuth, } from "../context";
import { lazy, Suspense } from "react";

const AuthLayout = lazy(() => import("../layouts/AuthLayout"));

export default function AppRoutes() {
  const { user } = useAuth()

  const router = createBrowserRouter([
    {
      path: "/",
      element: <RootLayout />,
      children: [
        {
          index: true,
          element: <Home />,
        },
        {
          path: "my-tasks",
          element: (
            <PrivateRoutes user={user}>
              <MyTasks />
            </PrivateRoutes>
          ),
        },
        {
          path: "new-task",
          element: (
            <PrivateRoutes user={user}>
              <NewTask />
            </PrivateRoutes>
          ),
        },
        {
          path: "edit-task/:taskId",
          element: (
            <PrivateRoutes user={user}>
              <EditTask />
            </PrivateRoutes>
          ),
        },
      ],
    },
    {
      element: (
        <PublicRoutes user={user}>
          <Suspense fallback={<div>Loading auth...</div>}>
            <AuthLayout />
          </Suspense>
        </PublicRoutes>
      ),
      children: [
        {
          path: "login",
          element: <Login />,
        },
        {
          path: "register",
          element: <Register />,
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}

