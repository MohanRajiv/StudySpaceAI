"use client";

import { useUser } from "@clerk/nextjs";
import { useEffect, useRef, useState } from "react";

export default function Home() {
  const { user } = useUser();
  const [randomInput, setRandomInput] = useState('');
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [totalSeconds, setTotalSeconds] = useState(0);
  const [timerExpired, setTimerExpired] = useState(false);
  const renders = useRef(0);
  const timerId = useRef();
  const [hideInput, setHideInput] = useState(false);

  const handleChange = (e) => {
    setRandomInput(e.target.value);
    renders.current++;
  }

  const buildTotalSeconds = () => {
    return hours * 3600 + minutes * 60 + seconds;
  };

  const setTimer = (seconds) => {
    setTotalSeconds(seconds)
  }

  const startTimer = () => {
    if (timerId.current) return;
  
    const total = buildTotalSeconds();
    if (total <= 0) return;
  
    setHideInput(true);
    setTimerExpired(false);
    setTotalSeconds(total);
  
    timerId.current = setInterval(() => {
      setTotalSeconds(prev => {
        if (prev <= 1) {
          clearInterval(timerId.current);
          timerId.current = null;
          setTimerExpired(true);
          setHideInput(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };
  
  const stopTimer = () => {
    clearInterval(timerId.current);
    timerId.current = null;
  };
  
  const resetTimer = () => {
    stopTimer();
    setTimerExpired(false);
    setHideInput(false);
    setTotalSeconds(0);
    setHours(0);
    setMinutes(0);
    setSeconds(0);
  };

  const formatTime = (secs) => {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
  
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  useEffect(() => {
    if (user) {
      const createUserInDB = async () => {
        await fetch("/api/users", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            clerkId: user.id,
            email: user.primaryEmailAddress.emailAddress,
          }),
        });
      };
      createUserInDB();
    }
  }, [user]);

  return (
    <div>
        {!hideInput && (
  <div>
    <p className="quizPageTextSecondary">Set Time</p>

    <input
      type="number"
      min="0"
      placeholder="Hours"
      value={hours}
      onChange={e => setHours(Number(e.target.value))}
      className="input-quiz-option-secondary-two"
    />

    <input
      type="number"
      min="0"
      max="59"
      placeholder="Minutes"
      value={minutes}
      onChange={e => setMinutes(Number(e.target.value))}
      className="input-quiz-option-secondary-two"
    />

    <input
      type="number"
      min="0"
      max="59"
      placeholder="Seconds"
      value={seconds}
      onChange={e => setSeconds(Number(e.target.value))}
      className="input-quiz-option-secondary-two"
    />
  </div>
)}

        
        <p className="quizPageTextSecondary">Time Remaining: {formatTime(totalSeconds)}</p>
        <section>
          <button className= "submitQuizButton" onClick={startTimer}>Start</button>
          <button className= "submitQuizButton" onClick={stopTimer}>Stop</button>
          <button className= "submitQuizButton" onClick={resetTimer}>Reset</button>
        </section>
        {timerExpired && (
          <div className="quizPageTextSecondary">
            Timer Expired
          </div>
        )}
    </div>
  );
}
