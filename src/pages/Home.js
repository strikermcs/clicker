import React, { useEffect, useRef, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import "../App.css";
import "../fire.scss";
import { AnimatePresence } from "framer-motion";
import Footer from "../Components/Footer";
import { UserProvider } from "../context/userContext";
import { isMobile, browserName } from 'react-device-detect';
import { TonConnectUIProvider } from "@tonconnect/ui-react";


const tele = window.Telegram.WebApp;
const Home = () => {
const [restrictAccess, setRestrictAccess] = useState(false)



  const location = useLocation();

  useEffect(() => {
    const handleContextMenu = (event) => event.preventDefault();
    const handleKeyDown = (event) => {
      if ((event.ctrlKey && (event.key === 'u' || event.key === 's')) || (event.ctrlKey && event.shiftKey && event.key === 'i')) {
        event.preventDefault();
      }
    };

    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);


    useEffect(() => {
        tele.ready();
        tele.expand();
        
        window.Telegram.WebApp.setHeaderColor('#191b33'); // Set header color to red

              // Haptic feedback
      if (tele.HapticFeedback) {
        tele.HapticFeedback.impactOccurred("medium");
      }


    }, []);

    const overflow = 100;
    const scrollableEl = useRef(null);
  
    useEffect(() => {
      const isDashboardRoute = location.pathname.startsWith('/dashboardAdx') || location.pathname.startsWith('/connect');
      const restrictedBrowsers = ['Chrome', 'Firefox', 'Edge', 'Safari', 'Thor', 'Brave'];


      if (
        (!isMobile && !isDashboardRoute) || (!isDashboardRoute && restrictedBrowsers.includes(browserName))) {
        setRestrictAccess(true);
      } 


      if (isDashboardRoute) {
        document.getElementById('footermain').style.display = 'none';
      }

      if (!isDashboardRoute) {
      document.body.style.overflowY = 'hidden';
      document.body.style.marginTop = `${overflow}px`;
      document.body.style.height = `${window.innerHeight + overflow}px`;
      document.body.style.paddingBottom = `${overflow}px`;
      window.scrollTo(0, overflow);
  
      let ts;
  
      const onTouchStart = (e) => {
        ts = e.touches[0].clientY;
      };
  
      const onTouchMove = (e) => {
        const el = scrollableEl.current;
        if (el) {
          const scroll = el.scrollTop;
          const te = e.changedTouches[0].clientY;
          if (scroll <= 0 && ts < te) {
            e.preventDefault();
          }
        } else {
          e.preventDefault();
        }
      };
      const onTouchMoveWithException = (e) => {
        const target = e.target.closest('#refer');
        if (!target) {
          onTouchMove(e);
        }
      };
    
      document.documentElement.addEventListener('touchstart', onTouchStart, { passive: false });
      document.documentElement.addEventListener('touchmove', onTouchMoveWithException, { passive: false });
    
      // Cleanup event listeners on component unmount
      return () => {
        document.documentElement.removeEventListener('touchstart', onTouchStart);
        document.documentElement.removeEventListener('touchmove', onTouchMoveWithException);
      };
    }
  }, [location.pathname, overflow]); 

    

  return (
<>

<div className="w-full flex justify-center">
        <div className="w-full flex justify-center">
          <div className="flex flex-col pt-8 space-y-3 w-full">


            

          <TonConnectUIProvider manifestUrl="https://yescoin.cbroclients.com/tonconnect-manifest.json">

          <UserProvider>
            <AnimatePresence mode="wait">

 
 
              <Outlet />
            <div id="footermain" className={`flex flex-col bg-[#1a1f2e] space-y-6 fixed bottom-0 py-6 left-0 right-0 justify-center items-center px-5`}>


<Footer/>
</div>
 
 




            </AnimatePresence>
            </UserProvider>
            </TonConnectUIProvider>
       
     
           </div>
           </div>
           </div>
           </>
  );
};

export default Home;
