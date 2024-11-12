import { doc, collection, addDoc, onSnapshot, deleteDoc } from "@firebase/firestore";
import { db } from "../../firebase/firestore";
import { useEffect, useState } from "react";


export const AdminTasks = () => {
    const [tasks, setTasks] = useState([]);
    const [taskTitle, setTaskTitle] = useState("");
    const [taskAmount, setTaskAmount] = useState(0);
    const [taskLink, setTaskLink] = useState("");
    const [description, setDescription] = useState("");
    const [isCheckTask, setIsCheckTask] = useState(false);
    const [chatId, setChatId] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [error, setError] = useState(false);

    const addTaskHandler = () => {
        setShowModal(true);
    }

    const addTask = async() => {
        try {
            if(taskTitle === "" || taskAmount === 0 || taskLink === "" || description === "" || chatId === "") {
                setError(true)
                return
            }
            setShowModal(false) 
            const task = {
                title: taskTitle,
                amount: taskAmount,
                link: taskLink,
                chatId: chatId,
                isCheckTask: isCheckTask,
                description: description,
                usersTaskCompleted: []
            }
             const docRef = await addDoc(collection(db, "tasks"), task);
             task.id = docRef.id
             setTasks([...tasks, task])
        } catch (error) {
            
        }
    }

    const deleteTask = (id) => {
        try {
            const docRef = doc(db, "tasks", id)
            deleteDoc(docRef).then(() => {
                
            })
        } catch (error) {
            
        }       
    }

    useEffect(() => {
        setError(false)

    }, [taskTitle, taskAmount, taskLink])

    useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, "tasks"), (snapshot) => {
          setTasks(
            snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
          );
        });
        return () => unsubscribe();
      }, []);

    return (
        <>
            <div className="flex p-4 justify-end">
                <button onClick={addTaskHandler} 
                    className="bg-[#f5bb5f] font-semibold text-[15px] rounded-[6px] w-full sm:w-[200px] h-fit px-4 py-3 text-[#000] hover:bg-[#f5bb5f]/80 transition-all duration-500">          
                        Add Task
                </button>
            </div>
            <div>
               {tasks.length === 0 && <div className="font-semibold text-[20px] text-[#fff]">No Tasks</div>}
               {tasks.length > 0 && <ul className="flex flex-col gap-2">
                    {tasks.map((task) => (
                        <li className="border-[1px] border-[#f5bb5f] rounded-[10px] p-4" key={task.id}>
                            <div className="flex justify-between items-center">
                                <span>{task.title}</span>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => deleteTask(task.id)} 
                                        className="bg-red font-semibold text-[15px] rounded-[6px]  h-fit px-3 py-1 text-[#000] hover:bg-[#f5bb5f]/80 transition-all duration-500">          
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul> }
            </div>
            {   showModal && (
                <div className="fixed z-50 left-0 right-0 top-0 bottom-0  flex justify-center taskbg px-[16px] h-full">
                    <div className="flex flex-col mt-28 space-y-4">
                        <div className="font-semibold text-[20px] text-[#fff]">
                            <span>New Task</span>
                            <button onClick={() => setShowModal(false)} className="absolute top-5 right-5 text-[#fff] font-semibold text-[20px]">X</button>
                        </div>
                        <div className="flex flex-col space-y-2">
                            <input type="text" placeholder="Task Title" value={taskTitle} onChange={(e) => setTaskTitle(e.target.value)} className="bg-[#332a46] rounded-[10px] p-4 text-[#fff] w-full" />
                            <input type="number" placeholder="Task Amount" value={taskAmount} onChange={(e) => setTaskAmount(e.target.value)} className="bg-[#332a46] rounded-[10px] p-4 text-[#fff] w-full" />
                            <input type="text" placeholder="Task Link" value={taskLink} onChange={(e) => setTaskLink(e.target.value)} className="bg-[#332a46] rounded-[10px] p-4 text-[#fff] w-full" />
                            <input type="text" placeholder="CHAT ID" value={chatId} onChange={(e) => setChatId(e.target.value)} className="bg-[#332a46] rounded-[10px] p-4 text-[#fff] w-full" />
                            <textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} className="bg-[#332a46] rounded-[10px] p-4 text-[#fff] w-full" />
                            <label className="flex items-center flex-row-reverse">
                                <span className="text-[#fff]">Check if the task is completed?</span>
                                <input type="checkbox" onChange={(e) => setIsCheckTask(e.target.checked)} className="bg-[#332a46] rounded-[10px] p-4 text-[#fff] w-full" />
                            </label>    
                            <button onClick={addTask} 
                                className="bg-[#f5bb5f] font-semibold text-[15px] rounded-[6px] h-fit px-4 py-3 text-[#000] hover:bg-[#f5bb5f]/80 transition-all duration-500">          
                                    Add Task
                            </button>
                           {error && <span className="text-[12px] text-red items-center font-semibold p-4 bg-slate-400 rounded-lg" >Error: All fields are required! </span> }
                        </div>
                    </div>
                </div> 
            )}
        </>
    );
};