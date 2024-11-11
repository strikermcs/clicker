import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import Ref from "./pages/Ref";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Home from "./pages/Home";
import ErrorCom from "./Components/ErrorCom";
import Tasks from "./pages/Tasks";
import Boost from "./pages/Boost";
import YesCoin from "./pages/YesCoin";
import Wallet from "./pages/Wallet";
import Dashboard from "./pages/Dashboard.js";
import Settings from "./pages/Settings.js";
import Search from "./pages/Search.js";
import Statistics from "./pages/Statistics.js";
import NotAdmin236 from "./pages/NotAdmin236.js";
import { AuthContextProvider } from "./context/AuthContext.js";
import AirdropWallets from "./pages/AirdropWallets.js";
import { AdminTasks } from "./pages/admin/Tasks.jsx";


const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
    errorElement: <ErrorCom />,
    children:[
      {
        path:"/",
        element: <YesCoin />,
      },
      {
        path:"/ref",
        element: <Ref />,
      },
      {
        path:"/tasks",
        element: <Tasks />,
      },
      {
        path:"/boost",
        element: <Boost />,
      },
      {
        path:"/wallet",
        element: <Wallet />,
      },
      {
        path:"/dashboardAdxadmin36024x",
        element: <NotAdmin236 />,
      },
    ]

  },
  {
    path: "/dashboardAdx",
    element: <Dashboard />,
    errorElement: <ErrorCom />,
    children:[
      {
        path:"/dashboardAdx/settings",
        element: <Settings />,
      },
      {
        path:"/dashboardAdx/search",
        element: <Search />,
      },
      {
        path:"/dashboardAdx/stats",
        element: <Statistics />,
      },
      {
        path:"/dashboardAdx/wallets",
        element: <AirdropWallets />,
      },

      {
        path:"/dashboardAdx/externaltasks",
        element: <AdminTasks />,
      }

    ]
  }
]);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(



      <AuthContextProvider>

    
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>

  </AuthContextProvider>

);
