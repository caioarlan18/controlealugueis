import styles from './SeeHome.module.css'
import { Header } from '../Header/Header'
import { initializeApp } from "firebase/app";
import { collection, getFirestore, getDocs } from "firebase/firestore";
import { useEffect, useState } from 'react'
import { FaCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { animateScroll as scroll } from 'react-scroll';

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
    var total = 0
    const prestacao = []

    users.forEach((user) => {
        if (user.homeData.isLeased === 'sim' && user.homeData.paid === 'não' && user.homeData.dayPayment > dia) {
            total += Number(user.homeData.homePrice);
            const prestacaoobj = {
                name: user.homeData.homeName,
                price: user.homeData.homePrice
            }

            prestacao.push(prestacaoobj)
        }
        if (user.homeData.isLeased === 'sim' && user.homeData.paid === 'não' && user.homeData.dayPayment < dia) {
            total += Number(user.homeData.homePrice)
            const prestacaoobj = {
                name: user.homeData.homeName,
                price: user.homeData.homePrice

            }
            prestacao.push(prestacaoobj)
        }

    });
    console.log(prestacao)
    return (
        <div>
            <Header page={'Gerenciar casas'} />


            <div className={styles.see}>

                {users.map((user) => (
                    <div className={styles.see1} key={user.id} onClick={() => { navigate(`/generalhome/${user.id}`); scroll.scrollToTop({ duration: 0 }) }}>

                        <div className={styles.see2}>
                            <img src={user.homeData.imagemURL} alt="imagem da casa" />
                            <h1>{user.homeData.homeName}</h1>
                            {user.homeData.isLeased === 'sim' ?
                                <div>
                                    <p>Valor do aluguel: R$ {user.homeData.homePrice}</p>
                                    <p>Dia do pagamento: {user.homeData.dayPayment}</p>
                                    {
                                        user.homeData.paid === 'sim' ? (
                                            user.homeData.dayPayment > dia ? (
                                                <p>
                                                    <FaCircle color="green" /> Pago
                                                </p>
                                            ) : (
                                                <p>
                                                    <FaCircle color="orange" /> Pendente
                                                </p>
                                            )
                                        ) : (
                                            user.homeData.paid === 'não' ? (
                                                user.homeData.dayPayment >= dia ? (
                                                    <p>
                                                        <FaCircle color="orange" /> Pendente
                                                    </p>
                                                ) : (
                                                    <p>
                                                        <FaCircle color="red" /> Devendo
                                                    </p>
                                                )
                                            ) : null
                                        )
                                    }

                                </div>
                                : user.homeData.isLeased === 'não' && (<p><FaCircle color="purple" /> Não está alugada</p>)
                            }





                        </div>

                    </div>

                ))}
            </div>
            {prestacao.map((pre, index) => (
                <div className={styles.menuBottom} key={index}>
                    <h1>Total a receber: {`R$${total}`}</h1>
                </div>

            ))}

        </div>
    )
}