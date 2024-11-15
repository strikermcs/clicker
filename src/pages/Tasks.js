import React, { useEffect, useState } from 'react'
import Animate from '../Components/Animate';
import { Outlet } from 'react-router-dom';
import coinsmall from "../images/coinsmall.webp";
import taskbook from "../images/taskbook.webp";
import { MdOutlineKeyboardArrowRight } from 'react-icons/md';
import { db } from "../firebase/firestore";
import { doc, getDoc, onSnapshot, collection } from 'firebase/firestore';
import Spinner from '../Components/Spinner';
import TaskOne from '../Components/TaskOne';
import ClaimLeveler from '../Components/ClaimLeveler';
import Levels from '../Components/Levels';
import { IoCheckmarkSharp } from "react-icons/io5";
import congrats from "../images/celebrate.gif";
import { useUser } from '../context/userContext';
import MilestoneRewards from '../Components/MilestoneRewards';
import ReferralRewards from '../Components/Rewards';


const Tasks = () => {




  const { id, balance, refBonus, taskCompleted, level, setTaskCompleted, taskCompleted2, setTaskCompleted2 } = useUser();
  // eslint-disable-next-line
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  // eslint-disable-next-line
  const [claimLevel, setClaimLevel] = useState(false);
  const [showLevels, setShowLevels] = useState(false);
  // eslint-disable-next-line
  const [message, setMessage] = useState("");
  const taskID = "task_3100"; // Assign a unique ID to this task
  const taskID2 = "task_3000"; // Assign a unique ID to this task

  const [tasks, setTasks] = useState([]);
  const [task, setTask] = useState(null);


  const [activeIndex, setActiveIndex] = useState(1);



  const handleMenu = (index) => {
    setActiveIndex(index);
  };


  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "tasks"), (snapshot) => {
      setTasks(
        snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
      );
    });
    return () => unsubscribe();
  }, []);


  useEffect(() => {

    // checkTaskCompletion(id, taskID).then((completed) => {
    //   setTaskCompleted(completed);
    //   if (completed) {
    //     setMessage("");
    //   }
    // });

    console.log('my userid is:', id)

    // eslint-disable-next-line
  }, []);

  // const checkTaskCompletion = async (id, taskId, taskId2) => {
  //   try {
  //     const userTaskDocRef = doc(db, 'userTasks', `${id}_${taskId}`);
  //     const userTaskDocRef2 = doc(db, 'userTasks', `${id}_${taskId2}`);
  //     const docSnap = await getDoc(userTaskDocRef, userTaskDocRef2);
  //     if (docSnap.exists()) {
  //       return docSnap.data().completed;
  //     } else {
  //       return false;
  //     }
  //   } catch (e) {
  //     console.error('Error checking task completion: ', e);
  //     return false;
  //   }
  // };


  const levelsAction = () => {

    setShowLevels(true);

    document.getElementById("footermain").style.zIndex = "50";

  }

  const formatNumber = (num) => {
    if (num < 100000) {
      return new Intl.NumberFormat().format(num).replace(/,/g, " ");
    } else if (num < 1000000) {
      return new Intl.NumberFormat().format(num).replace(/,/g, " ");
    } else {
      return (num / 1000000).toFixed(3).replace(".", ".") + " M";
    }
  };

  const handleTaskClick = (task) => {
    if(task.usersTaskCompleted.includes(id)) {
      return
    }
    setTask(task);
    setShowModal(true);
  };


  return (

    <>

      {loading ? (
        <Spinner />
      ) : (
        <Animate>
          <div className='w-full justify-center flex-col space-y-3 px-5'>



            <div className='fixed top-0 left-0 right-0 pt-8 px-5'>


              <div className="flex space-x-2 justify-center items-center relative">
                <div id="congrat" className='opacity-0 invisible w-[80%] absolute pl-10 ease-in-out duration-500 transition-all'>
                  <img src={congrats} alt="congrats" className="w-full" />
                </div>
                {/* <Congratulations showCongrats={showCongrats} setShowCongrats={setShowCongrats} /> */}
                <div className="w-[50px] h-[50px]">
                  <img src={coinsmall} className="w-full" alt="coin" />
                </div>
                <h1 className="text-[#fff] text-[42px] font-extrabold">
                  {formatNumber(balance + refBonus)}
                </h1>
              </div>
              {/* <div className="w-full flex space-x-1 items-center justify-center">
              <img src={bronze} className="w-[30px] h-[30px] relative" alt="bronze"/>
              <h2 className="text-[#9d99a9] text-[20px] font-medium">Wood</h2>
              <MdOutlineKeyboardArrowRight className="w-[20px] h-[20px] text-[#9d99a9] mt-[2px]"/>
            </div> */}

              <div onClick={levelsAction} className="w-full flex ml-[6px] space-x-1 items-center justify-center">
                <img src={level.imgUrl} className="w-[25px] relative" alt="bronze" />
                <h2 className="text-[#9d99a9] text-[20px] font-medium">{level.name}</h2>
                <MdOutlineKeyboardArrowRight className="w-[20px] h-[20px] text-[#9d99a9] mt-[2px]" />
              </div>


              <div className='bg-borders w-full px-5 h-[1px] !mt-5 !mb-5'></div>

              <div className='w-full border-[1px] border-borders rounded-[10px] p-1 flex items-center'>


                <div onClick={() => handleMenu(1)} className={`${activeIndex === 1 ? 'bg-cards' : ''}  rounded-[6px] py-[12px] px-3 w-[33%] flex justify-center text-center items-center`}>
                  Special
                </div>

                <div onClick={() => handleMenu(2)} className={`${activeIndex === 2 ? 'bg-cards' : ''}  rounded-[6px] py-[12px] px-3 w-[33%] flex justify-center text-center items-center`}>
                  Leagues
                </div>

                <div onClick={() => handleMenu(3)} className={`${activeIndex === 3 ? 'bg-cards' : ''}  rounded-[6px] py-[12px] px-3 w-[33%] flex justify-center text-center items-center`}>
                  Ref Tasks
                </div>

              </div>

            </div>


            <div className='!mt-[204px] w-full h-[60vh] flex flex-col'>

              <div id="refer" className={`${activeIndex === 1 ? 'flex' : 'hidden' } 'w-full flex flex-col space-y-[10px] scroller overflow-y-auto h-full pb-[150px]'`}>
                
              {tasks.map((task) => ( 
                
                <div onClick={() => handleTaskClick(task)} className='bg-cards rounded-[10px] p-[14px] flex justify-between items-center' key={task.id}>

                  <div className='flex flex-1 items-center space-x-2'>

                    <div className=''>
                      <img src={taskbook} alt="tasks" className='w-[50px]' />
                    </div>
                    <div className='flex flex-col space-y-1'>
                      <span className='font-semibold'>
                        { task.title }
                      </span>
                      <div className='flex items-center space-x-1'>
                        <span className="w-[20px] h-[20px]">
                          <img src={coinsmall} className="w-full" alt="coin" />
                        </span>
                        <span className='font-medium'>
                          { formatNumber(task.amount) } 
                        </span>
                      </div>
                    </div>

                  </div>

                  {/*  */}

                  { task.usersTaskCompleted && (
                  <div className=''>
                    {task.usersTaskCompleted.includes(id) ? (
                      <>

                        <IoCheckmarkSharp className="w-[20px] h-[20px] text-[#5bd173] mt-[2px]" />
                      </>
                    ) : (

                      <>

                        <MdOutlineKeyboardArrowRight className="w-[20px] h-[20px] text-[#e0e0e0] mt-[2px]" />
                      </>
                    )}


                  </div>)}

                
                </div> ))}

              </div>



              {/*  */}


              <div className={`${activeIndex === 2 ? 'flex' : 'hidden'} alltaskscontainer flex-col w-full space-y-2`}>



                <MilestoneRewards />



              </div>


              {/*  */}


              <div className={`${activeIndex === 3 ? 'flex' : 'hidden'} alltaskscontainer flex-col w-full space-y-2`}>


                <ReferralRewards />







              </div>

            </div>




            <TaskOne showModal={showModal} setShowModal={setShowModal} task={task}  />
            <ClaimLeveler claimLevel={claimLevel} setClaimLevel={setClaimLevel} />
            <Levels showLevels={showLevels} setShowLevels={setShowLevels} />



          </div>
          <Outlet />
        </Animate>
      )}
    </>
  )
}

export default Tasks