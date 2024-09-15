import { db } from ".";
import { getDoc, doc, addDoc, collection, getDocs } from "firebase/firestore";

export async function getCountingData() {
    try {
        const docRef = doc(db, 'accident', 'SeVki0IlXbW3J0jYo4bz');
        const docData = await getDoc(docRef);

        if (docData.exists()) {
            return docData.data();
        } else {
            console.log('Document does not exist');
            return null; 
        }
    } catch (error) {
        console.error('Error fetching document:', error);
        throw error;
    }
}


// Setting new Accident
export async function setNewAccident(accidentData) {
    try {
      const docRef = await addDoc(collection(db, 'accident'), {
        ...accidentData 
      })
      console.log("Accident report created with ID: ", docRef.id)
    } catch (error) {
      console.error("Error creating accident report: ", error)
    }
  }

// Setting new Department
  export async function setNewDepartment(DepartmentData) {
    try {
      const docRef = await addDoc(collection(db, 'departments'), {
        ...DepartmentData
      })
      console.log("Accident report created with ID: ", docRef.id)
    } catch (error) {
      console.error("Error creating accident report: ", error)
    }
  }

  // get all departments

  export async function getAllDepartments() {
    const collRef = collection(db, 'departments');
        const querySnapshot = await getDocs(collRef);
        const departments = querySnapshot.docs.map(doc => ({
            id: doc.id, 
            ...doc.data()
        }));
        return departments
  }



