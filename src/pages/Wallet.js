import React, { useEffect, useState, useRef } from "react";
import Animate from "../Components/Animate";
import { Outlet } from "react-router-dom";
import { useUser } from "../context/userContext";
import { PiEyeBold } from "react-icons/pi";
import { PiApproximateEquals } from "react-icons/pi";
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase/firestore'; // Adjust the path as needed
import { CiNoWaitingSign } from "react-icons/ci";
import { Address } from "../Components/Address";
import axios from "axios";


const Wallet = () => {

const [notData, setNotData] = useState({name: 'Notcoin', price: 0, icon: '/notcoin.jpg'});
const [bitData, setBitData] = useState({name: 'Bitcoin', price: 0, icon: '/bitcoin.png'});
const [solData, setSolData] = useState({name: 'Solana', price: 0, icon: '/solana.png'});
const [ethData, setEthData] = useState({name: 'Ethereum', price: 0, icon: '/ethereum.png'});
const [bnbData, setBnbData] = useState({name: 'Toncoin', price: 0, icon: '/ton.png'});
   // eslint-disable-next-line
const [pluData, setPluData] = useState({name: 'YesCoin', price: 0.0005289, icon: '/tapme1.webp'});

const {level, id, balance, refBonus, showBalance, setShowBalance} = useUser();

    const cryptoData = async () => {
        // setLoading(true);
        await axios.get('https://api.coingecko.com/api/v3/coins/notcoin', {
            headers: { 
              accept: 'application/json', 
              'x-cg-demo-api-key': 'CG-w3zjhwPTiZUc8zZwY45yLi1P'
            }
          }).then(response => setNotData({name: response.data.name, price: response.data.market_data.current_price.usd, icon: response.data.image.large}))
              .catch(err => console.error(err));
      
        await axios.get('https://api.coingecko.com/api/v3/coins/bitcoin', {
            headers: { 
              accept: 'application/json', 
              'x-cg-demo-api-key': 'CG-w3zjhwPTiZUc8zZwY45yLi1P'
            }
          }).then(response => setBitData({name: response.data.name, price: response.data.market_data.current_price.usd, icon: response.data.image.large}))
              .catch(err => console.error(err));
      
        await axios.get('https://api.coingecko.com/api/v3/coins/solana', {
            headers: { 
              accept: 'application/json', 
              'x-cg-demo-api-key': 'CG-w3zjhwPTiZUc8zZwY45yLi1P'
            }
          }).then(response => setSolData({name: response.data.name, price: response.data.market_data.current_price.usd, icon: response.data.image.large}))
              .catch(err => console.error(err));
      
        await axios.get('https://api.coingecko.com/api/v3/coins/ethereum', {
            headers: { 
              accept: 'application/json', 
              'x-cg-demo-api-key': 'CG-w3zjhwPTiZUc8zZwY45yLi1P'
            }
          }).then(response => setEthData({name: response.data.name, price: response.data.market_data.current_price.usd, icon: response.data.image.large}))
              .catch(err => console.error(err));
      
        await axios.get('https://api.coingecko.com/api/v3/coins/the-open-network', {
            headers: { 
              accept: 'application/json', 
              'x-cg-demo-api-key': 'CG-w3zjhwPTiZUc8zZwY45yLi1P'
            }
          }).then(response => setBnbData({name: response.data.name, price: response.data.market_data.current_price.usd, icon: response.data.image.large}))
              .catch(err => console.error(err));
         
      
          }
      
            useEffect(() => {
              cryptoData();
            //   setTimeout(() => {
            //     setLoading(false);
            //   },1000)
        }, []);
      




  // const ngtBal = 102491027712 / 21000000 * 0.01413;

  // const ngtBtc = ngtUsdt / bitData.price;
  // const ngtNot = ngtUsdt / notData.price;

  const dataList = [
      { name: notData.name, price: notData.price, icon: notData.icon },
      { name: bnbData.name, price: bnbData.price, icon: bnbData.icon },
      { name: bitData.name, price: bitData.price, icon: bitData.icon },
      { name: pluData.name, price: pluData.price, icon: pluData.icon },
    { name: solData.name, price: solData.price, icon: solData.icon },
    { name: ethData.name, price: ethData.price, icon: ethData.icon },
  ];

  const ngtUsdt = (balance + refBonus) * pluData.price;

  const [openInfoTwo, setOpenInfoTwo] = useState(false);


  const infoRefTwo = useRef(null);

  const handleClickOutside = (event) => {

    if (infoRefTwo.current && !infoRefTwo.current.contains(event.target)) {
      setOpenInfoTwo(false);
    }
  };

  useEffect(() => {
    if (openInfoTwo) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [openInfoTwo]);


  const formatNumber = (num) => {
    if (typeof num !== "number") {
      return "Invalid number";
    }
    
    // If the number is less than 1 and has more than 3 decimal places
    if (num < 1 && num.toString().split('.')[1]?.length > 3) {
      return num.toFixed(6).replace(/0+$/, ''); // Trims trailing zeroes
    }
    
    return num.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };



  const toggleBalance = async () => {
      const userRef = doc(db, 'telegramUsers', id.toString());
      setShowBalance(!showBalance);
      try {
        await updateDoc(userRef, {
          showBalance: !showBalance,
        });
        console.log('Toggled visibility successfully');
      } catch (error) {
        console.error('Error updating tap value:', error);
      }

  };

  return (
    <>
      {/* {loading ? (
        <Spinner />
      ) : ( */}
        <Animate>
         <div className="w-full mt-[-12px] justify-center flex-col space-y-3 px-5">



<div className="w-full text-center flex flex-col items-center justify-center space-y-3">

<div className="w-full text-left flex justify-between items-center">

            <h1 className="font-semibold text-[17px] text-center">
              My Assets
            </h1>
<div className="w-[60%]">

            <Address/>
</div>
</div>

        <div className="w-full flex flex-col bg-cards p-4 rounded-[12px] items-start text-left space-y-3">

          <span className="flex items-center text-[13px] space-x-3 text-[#a4a4a4]">
           <h2 className="text-[#a4a4a4]">
           Total Assets
            </h2>
            <PiEyeBold size={16} className="mt-[2px]" onClick={toggleBalance} />
            </span>

          <h3 className="flex items-center space-x-3">
          <span className="font-bold text-[30px] leading-[0]">
            {showBalance ? formatNumber(ngtUsdt) : '******'}
          </span>
          <span className="text-[13px] mt-2">
            USDT
          </span>
          </h3>
          <span className="flex items-center space-x-1 text-[13px]">
            <PiApproximateEquals size={10} className=""/>
            <span className="">
            {showBalance ? formatNumber(balance + refBonus) : '******'} PLT 
              </span>
          </span>

          {/* <button className="">

          </button> */}


        </div>



        <div onClick={() => setOpenInfoTwo(true)} className="flex space-x-4 pt-[2px] justify-between items-center w-full">
          <button className="w-[32%] bg-cards px-4 py-[10px] text-primary text-[12px] space-y-1 rounded-[8px] flex flex-col items-center justify-center">
            <img src="/withdraw.svg" alt="withdraw" className="w-[24px] h-[24px]"/>
            <span className="">
              Withdraw
            </span>

          </button>

          <button className="w-[32%] bg-cards px-4 py-[10px] text-primary text-[12px] space-y-1 rounded-[8px] flex flex-col items-center justify-center">
            <img src="/transfer.webp" alt="tarnsfer" className="w-[20px] h-[20px]"/>
            <span className="">
              Transfer
            </span>

          </button>

          <button className="w-[32%] bg-cards px-4 py-[10px] text-primary text-[12px] space-y-1 rounded-[8px] flex flex-col items-center justify-center">
            <img src="/convert.webp" alt="convert" className="w-[20px] h-[20px]"/>
            <span className="">
              Convert
            </span>

          </button>
        </div>


<div className="w-full pt-5 text-left flex justify-start">

<h1 className="font-semibold text-[17px] text-center">
  Similar Assets
</h1>

</div>

        <div id="refer" className="w-full flex flex-col space-y-[10px] scroller overflow-y-auto h-[50vh] pb-[150px]">

{/* {loading ? (
    <>
    <div className="w-full flex justify-center flex-col space-y-1 items-center pt-14 pulser">
        <img src="/tapme1.webp" className="w-[35px] loaderan"/>
        loading assets...
    </div>
    </>
) : (
    <>
     */}
    {dataList.map((data, index) => (

        <div key={index} className="w-full bg-cards text-[14px] rounded-[6px] px-4 py-4 flex items-center justify-between">

          <div className="flex flex-1 space-x-2 items-center">

            <span className="flex items-center justify-center">
                <img src={data.icon} alt={data.name} className="w-[30px] rounded-full"/>
            </span>
            <h4 className="">
              {data.name}
            </h4>

          </div>

          <div className="flex flex-col items-end font-medium">
{/* 
            <span className="text-primary">
              {formatNumber(ngtBtc)}
            </span> */}
            <span className="">
              ${formatNumber(data.price)}
            </span>

          </div>
          
        </div>

         ))}


         {/* </>
)} */}










{/* 
          <div className="w-full bg-cards2 text-[13px] rounded-[6px] px-4 py-4 flex items-center justify-between">

            <div className="flex flex-1 space-x-2 items-center">

              <span className="flex items-center justify-center">
                  <img src='/notgramxx.webp' alt="notgram" className="w-[30px] rounded-full"/>
              </span>
              <h4 className="">
                Notgram
              </h4>

            </div>

            <div className="flex flex-col items-end font-medium">

              <span className="text-primary">
                {formatNumber(balance + refBonus)}
              </span>
              <span className="">
              ${formatNumber(ngtBal)}
              </span>

            </div>
            
          </div> */}

        </div>





         
          </div>

          
</div>
          <Outlet />
        </Animate>
      {/* )} */}
<div 
        className={`${
          openInfoTwo=== true ? "visible" : "invisible"
        } fixed top-[-12px] bottom-0 left-0 z-40 right-0 h-[100vh] bg-[#00000042] flex justify-center items-center backdrop-blur-[6px] px-4`}
      >
  

    <div ref={infoRefTwo} className={`${
          openInfoTwo === true ? "opacity-100 mt-0 ease-in duration-300" : "opacity-0 mt-[100px]"
        } w-full bg-modal !bottom-0 relative rounded-[16px] flex flex-col justify-center p-8`}>
          <div className="w-full flex justify-center flex-col items-center space-y-3">
            <div className="w-full items-center justify-center flex flex-col space-y-2">
            <span className="w-[50px] flex items-center">
          <CiNoWaitingSign size={50} className="text-bronze"/>
        </span>
              <p className='font-medium'>not available yet</p>
            </div>
            <h3 className="font-medium text-center text-[20px] text-[#ffffff] pt-2 pb-2 uppercase">
         LOCKED!
            </h3>
            <p className="pb-6 text-[14px] w-full text-center">
            This feature will be unlocked when token lauch and airdrop distributed, keep accumulating YesCoin tokens and await huge benefits!
             </p>
          </div>

          <div className="w-full flex justify-center">
            <button
              onClick={() => setOpenInfoTwo(false)}
              className={`bg-${level.class} w-fit py-[10px] px-6 flex items-center justify-center text-center rounded-[12px] font-medium text-[16px]`}
            >
             Back to wallet
            </button>
          </div>
        </div>
      </div>

    </>
  );
};

export default Wallet;
