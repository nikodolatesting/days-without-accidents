"use client"

import { useState, useEffect } from "react"

export default function Counter() {
    const [realTime, setRealTime] = useState(new Date());

    useEffect(() => {
        const tick = () => {
            setRealTime(new Date());
            requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
        return () => cancelAnimationFrame(tick);
    }, []);

    return (
        <main>
            <div className="mainCounter">
                <h2>Current Seconds: {realTime.getSeconds()}</h2>
            </div>
            <div className="followUp">
                Follow Up
            </div>
        </main>
    )
}
