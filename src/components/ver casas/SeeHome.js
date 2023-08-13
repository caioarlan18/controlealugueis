import styles from './SeeHome.module.css'
import { Header } from '../Header/Header'
import { initializeApp } from "firebase/app";
import { collection, getFirestore, getDocs, addDoc, doc, deleteDoc } from "firebase/firestore";
import { useEffect, useState } from 'react'
export function SeeHome() {

    const [users, setUsers] = useState([])

    const firebaseConfig = initializeApp({
        apiKey: "AIzaSyBS5rk76snX7XU2pICUd_3bMtFFAYskdU0",
        authDomain: "controle-de-alugueis-2bed8.firebaseapp.com",
        projectId: "controle-de-alugueis-2bed8",
        storageBucket: "controle-de-alugueis-2bed8.appspot.com",
        messagingSenderId: "326472247960",
        appId: "1:326472247960:web:8376344064b07b7321feed",
        measurementId: "G-JWHYZ479EM"
    });
    const db = getFirestore(firebaseConfig);
    const useCollectionRef = collection(db, 'casas')
    useEffect(() => {
        const getUsers = async () => {
            const data = await getDocs(useCollectionRef)
            setUsers(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
        }
        getUsers()
    }, [])

    async function DeleteHome(id) {
        const userDoc = doc(db, 'casas', id)
        await deleteDoc(userDoc)
    }
    return (
        <div>
            <Header page={'Gerenciar casas'} />
            <div className={styles.see}>
                {users.map((user) => (
                    <div className={styles.see1}>
                        <img src={user.homeData.imagemURL} alt="imagem da casa" />
                        <h1>{user.homeData.homeName}</h1>
                        <p>R$ {user.homeData.homePrice}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}