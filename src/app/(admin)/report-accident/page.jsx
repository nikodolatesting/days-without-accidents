"use server"
import {setNewAccident, getAllDepartments } from '@/firebase/action'
import { cookies } from 'next/headers'


export default async function Admin(){
    const time = new Date()
    
    const allDepartments = await getAllDepartments()
    async function getFormData(formData) {
        "use server"
        const department = await formData.get('department')
        const title = await formData.get('title')
        const description = await formData.get('description')
        const cookiesStore = cookies()
        const lastAccident = cookiesStore.get('lastClick')?.value
        
        await setNewAccident({
            title,
            description,
            time,
            department,
            lastAccident,
        })
    }
    
    return(
        <main>
            <div className='flex justify-between'>
                    <div className='countSections'>
                        <p className='text-center'>Current Time</p>
                        <p className='number text-center'>0</p>
                    </div>
                    <div className='countSections'>
                        <p className='text-center'>Follow up</p>
                        <p className='number text-center'>0</p>
                    </div>
                    <div className='countSections'>
                        <p className='text-center'>last Activity</p>
                        <p className='number text-center'>0</p>
                    </div>
            </div>

        <form  action={getFormData} className="logInSignInForm">
            <input placeholder="title" name="title"/>
            <textarea className='h-24' placeholder="Accident description" name='description'/>
            <input className="outline-none" type="file" name="upload image or vido"/>
            <select name='department'>
                <option disabled hidden>Choose department</option>
                {allDepartments.map((item)=>(
                    <option key={item.name}>{item.name}</option>
                ))}
            </select>
            <button className='mainButton'>Submit</button>
         </form>
        </main>
    )
}