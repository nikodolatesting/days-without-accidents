"use client"
import { useUser } from "@/context/userContext"
import { useState } from "react"

export default function(){
    const {user, googleSign, logout} = useUser()
    
    return(
        <main>
            {user ? <p className="cursor-pointer" onClick={logout}>Logout</p> : <p onClick={googleSign} className="cursor-pointer">login</p>}
        </main>
    )
}