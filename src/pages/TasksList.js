import React, { useState, useEffect } from 'react';
import { collection, getDocs, updateDoc, doc, getDoc, arrayUnion, increment } from 'firebase/firestore';
import { db } from "../firebase/firestore"; // Import Firestore configuration
import axios from 'axios';
import Animate from '../Components/Animate';
import { Outlet } from 'react-router-dom';
import Spinner from '../Components/Spinner';
import { useUser } from "../context/userContext";
import { PiNotebook } from 'react-icons/pi';
import { FaBoxes } from "react-icons/fa";
import congratspic from "../images/celebrate.gif";
import { IoCheckmarkCircleSharp } from 'react-icons/io5';
import { RiArrowRightSLine } from "react-icons/ri";
import Levels from '../Components/Levels';


const TasksList = () => {
  const { id, balance, level, setLevel, refBonus, setBalance, completedTasks, setCompletedTasks, tasks, setTasks } = useUser(); // Assuming 'id' is the user's document ID in Firestore
  const [modalOpen, setModalOpen] = useState(false);
  const [taskModal, setTaskModal] = useState(false);
  const [countdowns, setCountdowns] = useState({});
  const [currentError, setCurrentError] = useState({}); // Task-specific error messages
  const [showVerifyButtons, setShowVerifyButtons] = useState({}); // State to manage the display of Verify buttons
  const [countdownFinished, setCountdownFinished] = useState({});
  const [claiming, setClaiming] = useState({});
  const [claimError, setClaimError] = useState('');
  const [activeIndex, setActiveIndex] = useState(1);
  const [claimedBonus, setClaimedBonus] = useState(0); // New state to store the claimed bonus amount
  const [congrats, setCongrats] = useState(false)
  const [showLevel, setShowLevel] = useState();
  const [selectedTask, setSelectedTask] = useState(null); // State to store selected task



  const handleMenu = (index) => {
    setActiveIndex(index);
  };

  

  const telegramBotToken = '7490661918:AAF_jM6rxU77J-POOcJl0JzVqBi5bZ-RNhU';

  const performTask = (taskId) => {
    const task = tasks.find(task => task.id === taskId);
    window.open(task.link, '_blank');
    setSelectedTask(task); // Store the selected task in state
    setTaskModal(true); // Open the modal
  
    setTimeout(() => {
      setShowVerifyButtons({ ...showVerifyButtons, [taskId]: true });
    }, 2000); // Show Verify button 2 seconds after clicking Perform
  };

  const checkTelegramMembership = async (taskId) => {
    try {
      const task = tasks.find(task => task.id === taskId);
      const response = await axios.get(`https://api.telegram.org/bot${telegramBotToken}/getChatMember`, {
        params: {
          chat_id: task.chatId,
          user_id: id, // Use the user's Firestore document ID as the Telegram user ID
        }
      });

      if (response.data.ok && (response.data.result.status === 'member' || response.data.result.status === 'administrator' || response.data.result.status === 'creator')) {
        // Update task verification status in Firestore
        setTasks(tasks.map(task => task.id === taskId ? { ...task, verified: true } : task));
      } else {
        setCurrentError({ [taskId]: `Verification failed for Task ${taskId}: Join the channel to verify.` });
      }
    } catch (error) {
      console.error('Error verifying Telegram membership:', error);
      setCurrentError({ [taskId]: `Verification failed for Task ${taskId}: Could not verify Telegram membership.` });
    }
  };

  const startCountdown = (taskId) => {
    setCurrentError({}); // Reset error state
    setCountdowns({ ...countdowns, [taskId]: 5 });

    const countdownInterval = setInterval(() => {
      setCountdowns(prevCountdowns => {
        const newCountdown = prevCountdowns[taskId] - 1;
        if (newCountdown <= 0) {
          clearInterval(countdownInterval);
          setCountdownFinished({ ...countdownFinished, [taskId]: true });
          return { ...prevCountdowns, [taskId]: 0 };
        }
        return { ...prevCountdowns, [taskId]: newCountdown };
      });
    }, 1000);

    checkTelegramMembership(taskId); // Call the API immediately
  };

  const claimTask = async (taskId) => {
    setClaiming({ ...claiming, [taskId]: true });
    setClaimError('');
    try {
      const task = tasks.find(task => task.id === taskId);
      const userDocRef = doc(db, 'telegramUsers', id);

      await updateDoc(userDocRef, {
        balance: increment(task.bonus),
        tasksCompleted: arrayUnion(taskId)
      });

      // Update the balance and completedTasks state
      setBalance(prevBalance => prevBalance + task.bonus);
      setCompletedTasks(prevCompletedTasks => [...prevCompletedTasks, taskId]);


      setClaimedBonus(task.bonus);
      setModalOpen(true);
      setCongrats(true)

      setTimeout(() => {
          setCongrats(false)
      }, 4000)
    } catch (error) {
      console.error('Error claiming task:', error);
      setClaimError('Failed to claim the task. Please try again.');
    } finally {
      setClaiming({ ...claiming, [taskId]: false });
    }
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const formatNumber = (num) => {
    if (num < 100000) {
      return new Intl.NumberFormat().format(num).replace(/,/g, " ");
    } else if (num < 1000000) {
      return new Intl.NumberFormat().format(num).replace(/,/g, " ");
    } else {
      return (num / 1000000).toFixed(3).replace(".", ".") + " M";
    }
  };
  const formatNumberCliam = (num) => {
    if (num < 100000) {
      return new Intl.NumberFormat().format(num).replace(/,/g, " ");
    } else if (num < 1000000) {
      return new Intl.NumberFormat().format(num).replace(/,/g, " ");
    } else {
      return (num / 1000000).toFixed(3).replace(".", ".") + " M";
    }
  };

  return (
    <>
      <Animate>
        <div className="w-full pt-1 justify-center flex-col space-y-6 px-5">

      <div className='w-full flex justify-between'>

      <button onClick={() => setShowLevel(true)} className='w-[55%] flex space-x-1 items-center'>
                <span className='flex items-center justify-center'>
                    
            <img src={level.imgUrl} className='w-[20px] h-full brightness-150'/>

            </span>
            <span className='font-semibold text-[15px] flex items-center space-x-1'>
               <span className=''> {level.name}</span> 
                <span className='flex items-center'>  <RiArrowRightSLine size={22} className=''/> </span>
            </span>
        </button>



    
          <div className='w-fit py-[4px] px-3 flex items-center space-x-1 justify-center border-[1px] border-[#707070] rounded-[25px]'>
            <span className='w-[22px]'>
              <img src='https://ucarecdn.com/8b43a50a-7638-4cde-9a70-b2a1d612c98b/engagesmall.webp' className='w-full' />
            </span>
            <h1 className="text-[15px] font-bold">
              {formatNumber(balance + refBonus)}
            </h1>
          </div>

          </div>

          <div className='w-full flex items-center justify-between'>

            <div onClick={() => handleMenu(1)} className={`${activeIndex === 1 ? 'bg-cards text-[#ebebeb]' : ''}  rounded-[6px] text-primary py-[10px] px-3 w-[45%] flex space-x-2 justify-center text-center text-[15px] font-semibold items-center`}>
              <PiNotebook size={16} className="" />
              <span>Tasks</span>
            </div>

            <div onClick={() => handleMenu(2)} className={`${activeIndex === 2 ? 'bg-cards text-[#ebebeb]' : ''}  rounded-[6px] text-primary py-[10px] px-3 w-[45%] space-x-2 font-semibold text-[15px] flex justify-center text-center items-center`}>
              <FaBoxes size={16} className="" />  <span>
                Challenges
              </span>
            </div>

          </div>

          <div className={`${activeIndex === 1 ? 'block' : 'hidden'}`}>
            <h1 className='text-[24px] font-semibold'>
              Earn more tokens
            </h1>
            <p className='text-[14px] leading-[24px]'>
              Perform tasks daily to earn more EN tokens and level up real quick!
            </p>
          </div>
          {/*  */}

          <div className={`${activeIndex === 2 ? 'block' : 'hidden'}`}>
            <h1 className='text-[24px] font-semibold'>
              Milestone rewards
            </h1>
            <p className='text-[14px] leading-[24px]'>
              Complete specific milestones to unlock huge rewards and bonuses!
            </p>
          </div>

          <div id="refer" className="w-full h-[60vh] scroller rounded-[10px] overflow-y-auto pt-2 pb-[180px]">


{/* tasks */}
          <div className={`${activeIndex === 1 ? 'block' : 'hidden'} w-full flex items-end justify-center flex-col space-y-4`}>
          {tasks.map(task => (
            <>
                              <div onClick={() => performTask(task)}
 key={task.id} className="w-[93%] rounded-[25px] bg-gradient-to-r from-[#454545] to-[#575349] p-[1px]">
    <div className="flex h-full w-full flex-col bg-[#2d2d2d] justify-center rounded-[24px] py-4 pl-12 pr-4 relative">
        <div className='w-[60px] h-[60px] rounded-[12px] p-2 absolute bg-[#8a8a8a] left-[-7%] todp-[40px] flex items-center justify-center'>
            <img src={task.icon} className='w-[40px]'/>
        </div>
        <div className='flex w-full flex-col justify-between h-full space-y-2'>
      <h1 className="text-[15px] text-nowrap line-clamp-1 mr-[5px] font-medium">
      {task.title}
        </h1>
      <span className='flex text-primary items-center w-fit space-x-1 text-[14px] font-semibold'>
        <span className='w-[10px] h-[10px] bg-accent rounded-full flex items-center'>
        </span>
        <span className=''>
+{formatNumber(task.bonus)}
        </span>
      </span>



        


      </div>
    </div>
  </div>
            </>
          ))}





          {selectedTask && (

            <>

<div
        className={`${
          taskModal === true ? "visible" : "invisible"
        } fixed top-[-12px] bottom-0 left-0 z-40 right-0 h-[100vh] bg-[#00000042] flex justify-center items-center backdrop-blur-[6px] px-4`}
      >
  

    <div className={`${
          taskModal === true ? "opacity-100 mt-0 ease-in duration-300" : "opacity-0 mt-[100px]"
        } w-full bg-modal relative rounded-[16px] flex flex-col justify-center p-8`}>

                  <div className='w-full flex items-center justify-between flex-wrap text-[14px] relative'>


{!completedTasks.includes(selectedTask) && (
            <>
              <button
                onClick={() => performTask(selectedTask.id)}
                className={`w-fit py-[6px] px-4 font-medium bg-[#595959cc] hover:bg-[#8a8a8a] text-[#fff] hover:text-[#000] ease-in duration-200 rounded-[6px] ${selectedTask.verified && countdownFinished[selectedTask.id] ? 'hidden' : ''}`}
                disabled={selectedTask.verified && countdownFinished[selectedTask.id]}
              >
                Perform
              </button>
              <button
                onClick={() => startCountdown(selectedTask.id)}
                className={`w-fit py-[6px] px-4 font-medium rounded-[6px] ${countdowns[selectedTask.id] ? 'hidden' : showVerifyButtons[selectedTask.id] ? 'bg-btn' : 'bg-btn2'}`}
                disabled={!showVerifyButtons[selectedTask.id] || (selectedTask.verified && countdownFinished[selectedTask.id])}
              >
                Verify
              </button>
            </>
          )}

{/*  */}

{countdowns[selectedTask.id] ? (
            <span className="w-fit py-[6px] px-4 font-medium bg-btn2 rounded-[6px]">
              checking.. {countdowns[selectedTask.id]}s
            </span>
          ) : (
            <>
              {selectedTask.verified && countdownFinished[selectedTask.id] && !completedTasks.includes(selectedTask.id) ? <span className="w-fit py-[6px] px-[1.2rem] absolute left-[-1px] font-medium bg-[#494949] text-[#b8b8b8] rounded-[6px]">Done</span> :
                currentError[selectedTask.id] && <span className="text-accent pt-2 text-xs w-full">{currentError[selectedTask.id]}</span>}
              {completedTasks.includes(selectedTask.id) && (
              <> 
             
              <span className="w-fit py-[6px] px-4 font-medium bg-[#494949] text-[#b8b8b8] rounded-[6px]">Completed</span>

              <span className='mr-[6px]'>

                <IoCheckmarkCircleSharp size={24} className='text-accent'/>

              </span>
              </>
              )}
            </>
          )}

          {/*  */}

          {!completedTasks.includes(selectedTask.id) && (
            <button
              onClick={() => claimTask(selectedTask.id)}
              disabled={!selectedTask.verified || claiming[selectedTask.id] || !countdownFinished[selectedTask.id]}
              className={`w-fit py-[6px] px-4 font-medium bg-btn rounded-[6px] ${selectedTask.verified && countdownFinished[selectedTask.id] ? '' : 'hidden'}`}
            >
              {claiming[selectedTask.id] ? 'Claiming...' : 'Claim'}
            </button>
          )}


  </div>

  {claimError && (
          <p className="text-accent pt-2 text-xs w-full">{claimError}</p>
        )}

        </div>
        </div>
            </>

          )}


<div
        className={`${
          modalOpen === true ? "visible" : "invisible"
        } fixed top-[-12px] bottom-0 left-0 z-40 right-0 h-[100vh] bg-[#00000042] flex justify-center items-center backdrop-blur-[6px] px-4`}
      >
  

    <div className={`${
          modalOpen === true ? "opacity-100 mt-0 ease-in duration-300" : "opacity-0 mt-[100px]"
        } w-full bg-modal relative rounded-[16px] flex flex-col justify-center p-8`}>
          <div className="w-full flex justify-center flex-col items-center space-y-3">
            <div className="w-full items-center justify-center flex flex-col space-y-2">
              <IoCheckmarkCircleSharp size={32} className='text-accent'/>
              <p className='font-medium'>Let's go!!</p>
            </div>
            <h3 className="font-medium text-[20px] text-[#ffffff] pt-2 pb-2">
              <span className='text-accent'>+{formatNumberCliam(claimedBonus)}</span> EN CLAIMED
            </h3>
            <p className="pb-6 text-[#9a96a6] text-[15px] w-full text-center">
              Keep performing new tasks! something huge is coming! Perform more and earn more ENG now! 
            </p>
          </div>

          <div className="w-full flex justify-center">
            <button
              onClick={closeModal}
              className="bg-btn w-fit py-[10px] px-6 flex items-center justify-center text-center rounded-[12px] font-medium text-[16px]"
            >
             Continue tasks
            </button>
          </div>
        </div>
      </div>

          </div>


{/* challenges */}

<div className={`${activeIndex === 2 ? 'block' : 'hidden'} w-full flex items-end justify-center flex-col space-y-4`}>

  {/* <MilestoneRewards/> */}

  </div>



          </div>

   

<div className='w-full absolute top-[50px] left-0 right-0 flex justify-center z-50 pointer-events-none select-none'>
      {congrats ? (<img src={congratspic} alt="congrats" className="w-[80%]"/>) : (<></>)}
      </div>

      <Levels showLevel={showLevel} setShowLevel={setShowLevel} />

        </div>
        <Outlet />
      </Animate>
    </>
  );
};

export default TasksList;
