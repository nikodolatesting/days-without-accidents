import { setNewDepartment } from '@/firebase/action'
import { cookies } from 'next/headers'
import { notFound } from 'next/navigation'

export default function addDepartment(){
   const cookiesStore = cookies()
   const user = cookiesStore.get('user_id')?.value

   
   async function addNewDepartment(formData){
      "use server"
      const name = await formData.get('name')
      await setNewDepartment({name})
   }


   
   return(
      <>
      {user ?       <form action={addNewDepartment}>
      <input placeholder='add department' type='department' name='name'/>
      <button className='mainButton'>Add new department</button>
      </form> : notFound() }

      </>
   )
}