import { Header } from "../Header/Header"
import styles from './GeneralHome.module.css'
import { getFirestore, getDoc, doc } from "firebase/firestore";
import { initializeApp } from "firebase/app";
import { FaCircle } from 'react-icons/fa';
import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom';
import { animateScroll as scroll } from 'react-scroll';

export function GeneralHome() {
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
    const { id } = useParams()
    const [userData, setUserData] = useState({
        homeData: {
            imagemURL: '',
            homeName: '',
            isLeased: '',
            homePrice: '',
            dayPayment: '',
            paid: '',
            personName: '',
            personNumber: '',
            waterNumber: '',
            lightNumber: '',
            startContractDate: '',
            contractTime: '',
            dayFees: '',
            totalFees: '',
            cep: '',
            endereco: '',
            numero: '',
            bairro: '',
            cidade: '',
            estado: '',
        }
    });

    useEffect(() => {
        const fetchUserData = async () => {
            const userRef = doc(db, 'casas', id);

            try {
                const userDoc = await getDoc(userRef);
                if (userDoc.exists()) {
                    setUserData(userDoc.data());
                } else {
                    console.log('Documento não encontrado.');
                }
            } catch (error) {
                console.error('Erro ao buscar documento:', error);
            }
        };

        fetchUserData();
    }, [id]);
    const data = new Date()
    const dia = data.getDate()
    var status = ''
    const navigate = useNavigate()

    const vencimento = new Date(userData.homeData.startContractDate)
    const diaVencimento = vencimento.getDate() + 1
    const mesVencimento = vencimento.getMonth() + 1
    const anoVencimento = vencimento.getFullYear()

    return (
        <div>
            <Header page={'Informações gerais'} />
            <div className={styles.general}>

                <div className={styles.general1}>
                    <img src={userData.homeData.imagemURL} alt="imagem da casa" />
                </div>
                <div className={styles.general1}>
                    <h1>Status: {userData.homeData.isLeased === 'sim' ?
                        <>
                            {userData.homeData.paid === 'sim' ? (
                                userData.homeData.dayPayment > dia ? (
                                    <p>
                                        <FaCircle color="green" /> {(status = 'Pago')}
                                    </p>
                                ) : (
                                    <p>
                                        <FaCircle color="orange" /> {(userData.homeData.paid = 'não')}
                                        {(status = 'Pendente')}
                                    </p>
                                )
                            ) : userData.homeData.paid === 'não' ? (
                                userData.homeData.dayPayment > dia ? (
                                    <p>
                                        <FaCircle color="orange" /> {(status = 'Pendente')}
                                    </p>
                                ) : (
                                    <p>
                                        <FaCircle color="red" /> {(status = 'Devendo')}
                                    </p>
                                )
                            ) : null}

                        </>
                        : userData.homeData.isLeased === 'não' && (<span> <FaCircle color="purple" />{status = 'Não está alugada'}</span>)
                    }
                    </h1>
                </div>

                {userData.homeData.isLeased === 'sim' &&
                    <div className={styles.general1}>
                        <h1>Meses para acabar o contrato: <span></span></h1>
                    </div>
                }



                <div className={styles.general1}>
                    <h1>Nome da casa: <span>{userData.homeData.homeName}</span></h1>
                    <h1>Está alugada: <span>{userData.homeData.isLeased}</span></h1>
                    {userData.homeData.isLeased === 'sim' &&
                        <div>
                            <h1>Valor do aluguel: <span>{userData.homeData.homePrice}</span></h1>
                            <h1>Dia do pagamento: <span>{userData.homeData.dayPayment}</span></h1>
                            <h1>Já pagou? <span>{userData.homeData.paid}</span></h1>
                            <h1>Nome do inquilino: <span>{userData.homeData.personName}</span></h1>
                            <h1>Número do inquilino <span>{userData.homeData.personNumber}</span></h1>
                            <h1>Número da matrícula da água: <span>{userData.homeData.waterNumber}</span></h1>
                            <h1>Número da matrícula da luz: <span>{userData.homeData.lightNumber}</span></h1>
                            <h1>Data de início do contrato: <span>{`${diaVencimento}/${mesVencimento}/${anoVencimento}`}</span></h1>
                            <h1>Tempo do contrato (em meses): <span>{userData.homeData.contractTime}</span></h1>
                            <h1>Juros por dia (em %): <span>{userData.homeData.dayFees}</span></h1>
                            <h1>Juros sob o valor total (em %): <span>{userData.homeData.totalFees}</span></h1>

                        </div>
                    }
                    <h1>Cep: <span>{userData.homeData.cep}</span></h1>
                    <h1>Endereço: <span>{userData.homeData.endereco}</span></h1>
                    <h1>Número: <span>{userData.homeData.numero}</span></h1>
                    <h1>Bairro: <span>{userData.homeData.bairro}</span></h1>
                    <h1>Cidade: <span>{userData.homeData.cidade}</span></h1>
                    <h1>Estado: <span>{userData.homeData.estado}</span></h1>
                </div>
                <div className={styles.general1}>
                    <button onClick={() => {
                        navigate(`/updatehome/${id}`); scroll.scrollToTop({ duration: 0 });
                    }}>Editar Informações</button>
                </div>
            </div>
        </div >
    )
}