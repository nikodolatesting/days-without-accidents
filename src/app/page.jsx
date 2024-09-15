"use client"
import { useState, useEffect } from "react"
import Cookies from "js-cookie";

export default function Counter(){
  const [timeNow, setTimeNow] = useState(0)
  const [followUp, setFollowUp] = useState(0)
  const seconds = new Date().getSeconds()
  
  useEffect(()=>{
    const intervalID = setInterval(() => {
      setTimeNow(seconds)
      setFollowUp((x)=> x + 1)
    }, 1000);
    return () => clearInterval(intervalID)
  },[seconds])
  
  const handleReset = () => {
    const localStorageFollowUp = localStorage.setItem('followUp', followUp)
    const getLocalStorage = localStorage.getItem('followUp', followUp)
    Cookies.set('lastClick', getLocalStorage, { expires: 365 * 100, path: '/' });
    setFollowUp((x) => 0) 
  }

  

  return (
    <div>
      <p>{timeNow}</p>
      <p>{followUp}</p>
      <button onClick={handleReset}>Reset</button>
    </div>
  )
}
