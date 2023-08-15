import styles from './SeeHome.module.css'
import { Header } from '../Header/Header'
import { initializeApp } from "firebase/app";
import { collection, getFirestore, getDocs, addDoc, doc, deleteDoc } from "firebase/firestore";
import { useEffect, useState } from 'react'
import { FaCircle } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { UpdateHome } from '../atualizar dados/UpdateHome';
import { Navigate } from 'react-router-dom';
export function SeeHome() {
    const navigate = useNavigate()
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


    const data = new Date()
    const dia = data.getDate()
    var status = ''

    return (
        <div>
            <Header page={'Gerenciar casas'} />


            <div className={styles.see}>

                {users.map((user) => (
                    <div className={styles.see1} key={user.id} onClick={() => { navigate(`/updatehome/${user.id}`) }}>

                        <div className={styles.see2}>
                            <img src={user.homeData.imagemURL} alt="imagem da casa" />
                            <h1>{user.homeData.homeName}</h1>
                            {user.homeData.isLeased === 'sim' ?
                                <div>
                                    <p>Valor do aluguel: R$ {user.homeData.homePrice}</p>
                                    <p>Dia do pagamento: {user.homeData.dayPayment}</p>
                                    {user.homeData.paid === 'não' && user.homeData.dayPayment > dia && (<p><FaCircle color="orange" /> {status = 'Pendente'}</p>)}
                                    {user.homeData.paid === 'sim' && user.homeData.dayPayment < dia && (user.homeData.paid = 'não')}
                                    {user.homeData.paid === 'sim' && user.homeData.dayPayment > dia && (<p><FaCircle color="green" /> {status = 'Pago'}</p>)}
                                    {user.homeData.paid === 'não' && user.homeData.dayPayment < dia && (<p><FaCircle color="red" /> {status = 'Devendo'}</p>)}
                                    {user.homeData.dayPayment == dia && (<p><FaCircle color="blue" /> {status = '...'}</p>)}

                                </div>
                                : user.homeData.isLeased === 'não' && (<p><FaCircle color="purple" /> {status = 'Não está alugada'}</p>)
                            }





                        </div>

                    </div>

                ))}
            </div>

        </div>
    )
}