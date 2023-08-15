import styles from './UpdateHome.module.css'
import { Header } from '../Header/Header'
import { useState, useEffect } from 'react'
import axios from 'axios'
import { initializeApp } from "firebase/app";
import { collection, getFirestore, getDoc, addDoc, doc, deleteDoc, updateDoc, setDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage'
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
export function UpdateHome() {
    const [users, setUsers] = useState([])
    const [homeName, setHomeName] = useState('')
    const [isLeased, setIsLeased] = useState('')
    const [homePrice, setHomePrice] = useState('')
    const [dayPayment, setDayPayment] = useState('')
    const [personName, setPersonName] = useState('')
    const [personNumber, setPersonNumber] = useState('')
    const [waterNumber, setWaterNumber] = useState('')
    const [lightNumber, setLightNumber] = useState('')
    const [startContractDate, setStartContractDate] = useState('')
    const [contractTime, setContractTime] = useState('')
    const [dayFees, setDayFees] = useState('')
    const [totalFees, setTotalFees] = useState('')
    const [cep, setCep] = useState('')
    const [endereco, setEndereco] = useState('')
    const [numero, setNumero] = useState('')
    const [bairro, setBairro] = useState('')
    const [cidade, setCidade] = useState('')
    const [estado, setEstado] = useState('')
    const [mostrarCampos, setMostrarCampos] = useState(false);
    const [erroCEP, setErroCEP] = useState(false);
    const [imagemURL, setImagemURL] = useState('');
    const [progress, setProgress] = useState(0);
    const [selectedOption, setSelectedOption] = useState('');

    const { id } = useParams()

    const navigate = useNavigate()
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
    const storage = getStorage(firebaseConfig);


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





    useEffect(() => {
        if (cep.length === 8) {
            buscarEnderecoPorCEP();
        } else {
            limparCamposEndereco();
            setMostrarCampos(false);
            setErroCEP(false);
        }
    }, [cep]);

    const buscarEnderecoPorCEP = async () => {
        try {
            const response = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);
            const data = response.data;

            if (data.erro) {
                limparCamposEndereco();
                setMostrarCampos(false);
                setErroCEP(true);
            } else {
                setEndereco(data.logradouro);
                setBairro(data.bairro);
                setCidade(data.localidade);
                setEstado(data.uf);
                setMostrarCampos(true);
                setErroCEP(false);
            }
        } catch (error) {
            limparCamposEndereco();
            setMostrarCampos(false);
            setErroCEP(true);
        }
    };

    const limparCamposEndereco = () => {
        setEndereco('');
        setNumero('');
        setBairro('');
        setCidade('');
        setEstado('');
    };

    const handleImagemChange = (event) => {
        event.preventDefault();
        const file = event.target.files[0];
        const storageRef = ref(storage, `images/${file.name}`);
        const uploadTask = uploadBytesResumable(storageRef, file);

        uploadTask.on(
            "state_changed",
            snapshot => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                setProgress(progress);
            },
            error => {
                alert(error);
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then(url => {

                    setUserData(prevUserData => ({
                        ...prevUserData,
                        homeData: {
                            ...prevUserData.homeData,
                            imagemURL: url, // Atualize também a imagemURL dentro do userData
                        },
                    }));
                });
            }
        );
    };

    const handleRemoveImagem = async () => {
        if (userData.homeData.imagemURL) {
            try {
                const imageRef = ref(storage, userData.homeData.imagemURL);


                await deleteObject(imageRef);
                console.log('Arquivo removido com sucesso do Firebase Storage');


                setUserData(prevUserData => ({
                    ...prevUserData,
                    homeData: {
                        ...prevUserData.homeData,
                        imagemURL: '',
                    },
                }));
            } catch (error) {
                console.error('Erro ao remover o arquivo:', error);
            }
        }
    };
    async function DeleteHome() {
        const userDoc = doc(db, 'casas', id)
        await deleteDoc(userDoc)
        alert('Casa removida com sucesso')
        navigate('/seehome')
    }
    const userRef = doc(db, 'casas', id);

    async function editDoc() {
        try {
            if (userData.homeData.isLeased === 'não') {
                if (userData.homeData.imagemURL && userData.homeData.homeName && userData.homeData.cep && userData.homeData.endereco && userData.homeData.numero && userData.homeData.bairro && userData.homeData.cidade && userData.homeData.estado !== '') {
                    await updateDoc(userRef, {
                        homeData: userData.homeData
                    });
                    alert('Sua casa foi atualizada com sucesso')
                } else {
                    alert('Existem campos vazios')
                }
            } else {
                if (userData.homeData.imagemURL && userData.homeData.homeName && userData.homeData.homePrice && userData.homeData.dayPayment && userData.homeData.personName && userData.homeData.personNumber && userData.homeData.waterNumber && userData.homeData.lightNumber && userData.homeData.startContractDate && userData.homeData.contractTime && userData.homeData.dayFees && userData.homeData.totalFees && userData.homeData.cep && userData.homeData.endereco && userData.homeData.numero && userData.homeData.bairro && userData.homeData.cidade && userData.homeData.estado !== '') {
                    await updateDoc(userRef, {
                        homeData: userData.homeData
                    });
                    alert('Sua casa foi atualizada com sucesso')
                } else {
                    alert('Existem campos vazios')
                }
            }
        } catch (error) {
            console.error("Erro ao atualizar o documento:", error);
            alert('Erro ao atualizar a casa');
        }
    }








    return (
        <div>
            <Header page={'Atualizar casa'} />

            <div className={styles.add}>
                <div className={styles.add1}>
                    <h1>Informações da casa</h1>
                </div>
                <div className={styles.add1}>
                    <div className={styles.pc}>
                        <div className={styles.add2img}>
                            <p>Imagem da casa</p>
                            <input type="file" accept="image/*" onChange={handleImagemChange} />

                            <div className={styles.upimg}>
                                <div>
                                    <img src={userData.homeData.imagemURL} alt="Imagem Carregada" />
                                </div>

                                <div>
                                    <button onClick={handleRemoveImagem}>Remover Imagem</button>
                                </div>

                            </div>



                        </div>
                    </div>
                    <div className={styles.pc2}>
                        <div className={styles.add2}>
                            <p>Nome da casa</p>
                            <input type="text" value={userData.homeData.homeName} onChange={(e) =>
                                setUserData({
                                    ...userData,
                                    homeData: {
                                        ...userData.homeData,
                                        homeName: e.target.value,
                                    },
                                })
                            } placeholder='exemplo: casa3' />

                        </div>
                        <div className={styles.add2}>
                            <p>Está alugada?</p>
                            <select value={userData.homeData.isLeased} onChange={(e) =>
                                setUserData({
                                    ...userData,
                                    homeData: {
                                        ...userData.homeData,
                                        isLeased: e.target.value,
                                    },
                                })
                            }  >
                                <option value="não">Não</option>
                                <option value="sim">Sim</option>
                            </select>
                        </div>
                        {userData.homeData.isLeased === 'sim' &&
                            <div>
                                <div className={styles.add2}>
                                    <p>Valor do Aluguel</p>
                                    <input type="number" value={userData.homeData.homePrice} onChange={(e) =>
                                        setUserData({
                                            ...userData,
                                            homeData: {
                                                ...userData.homeData,
                                                homePrice: e.target.value,
                                            },
                                        })
                                    } />
                                </div>
                                <div className={styles.add2}>
                                    <p>Dia do pagamento do aluguel</p>
                                    <input type="number" value={userData.homeData.dayPayment} onChange={(e) =>
                                        setUserData({
                                            ...userData,
                                            homeData: {
                                                ...userData.homeData,
                                                dayPayment: e.target.value,
                                            },
                                        })
                                    } min={1}
                                        max={30} placeholder='exemplo: 20' />
                                </div>
                                <div className={styles.add2}>
                                    <p>Já pagou?</p>
                                    <select value={userData.homeData.paid} onChange={(e) =>
                                        setUserData({
                                            ...userData,
                                            homeData: {
                                                ...userData.homeData,
                                                paid: e.target.value,
                                            },
                                        })
                                    } >
                                        <option value="sim">Sim</option>
                                        <option value="não">Não</option>
                                    </select>
                                </div>
                                <div className={styles.add2}>
                                    <p>Nome do inquilino</p>
                                    <input type="text" value={userData.homeData.personName} onChange={(e) =>
                                        setUserData({
                                            ...userData,
                                            homeData: {
                                                ...userData.homeData,
                                                personName: e.target.value,
                                            },
                                        })
                                    } placeholder='exemplo: pedro silva' />
                                </div>
                                <div className={styles.add2}>
                                    <p>Número do inquilino</p>
                                    <input type="text" value={userData.homeData.personNumber} onChange={(e) =>
                                        setUserData({
                                            ...userData,
                                            homeData: {
                                                ...userData.homeData,
                                                personNumber: e.target.value,
                                            },
                                        })
                                    } placeholder='exemplo: 999999999' />
                                </div>
                                <div className={styles.add2}>
                                    <p>Número da matrícula da água</p>
                                    <input type="text" value={userData.homeData.waterNumber} onChange={(e) =>
                                        setUserData({
                                            ...userData,
                                            homeData: {
                                                ...userData.homeData,
                                                waterNumber: e.target.value,
                                            },
                                        })
                                    } />
                                </div>
                                <div className={styles.add2}>
                                    <p>Número da matrícula da luz</p>
                                    <input type="text" value={userData.homeData.lightNumber} onChange={(e) =>
                                        setUserData({
                                            ...userData,
                                            homeData: {
                                                ...userData.homeData,
                                                lightNumber: e.target.value,
                                            },
                                        })
                                    } />
                                </div>
                                <div className={styles.add2}>
                                    <p>Data de início do contrato</p>
                                    <input type="date" value={userData.homeData.startContractDate} onChange={(e) =>
                                        setUserData({
                                            ...userData,
                                            homeData: {
                                                ...userData.homeData,
                                                startContractDate: e.target.value,
                                            },
                                        })
                                    } />
                                </div>

                                <div className={styles.add2}>
                                    <p>Tempo do contrato (em meses)</p>
                                    <input type="number" value={userData.homeData.contractTime} onChange={(e) =>
                                        setUserData({
                                            ...userData,
                                            homeData: {
                                                ...userData.homeData,
                                                contractTime: e.target.value,
                                            },
                                        })
                                    } placeholder='exemplo: 12' />
                                </div>
                                <div className={styles.add2}>
                                    <p>Juros por dia (em %)</p>
                                    <input type="number" value={userData.homeData.dayFees} onChange={(e) =>
                                        setUserData({
                                            ...userData,
                                            homeData: {
                                                ...userData.homeData,
                                                dayFees: e.target.value,
                                            },
                                        })
                                    } placeholder='exemplo: 2' />
                                </div>
                                <div className={styles.add2}>
                                    <p>Juros sob o valor total (em %)</p>
                                    <input type="number" value={userData.homeData.totalFees} onChange={(e) =>
                                        setUserData({
                                            ...userData,
                                            homeData: {
                                                ...userData.homeData,
                                                totalFees: e.target.value,
                                            },
                                        })
                                    } placeholder='exemplo: 10' />
                                </div>
                            </div>
                        }

                        <div className={styles.add2}>
                            <p>CEP {erroCEP && <span style={{ color: 'red' }}>(CEP inválido)</span>}</p>
                            <input type="number" value={userData.homeData.cep} onChange={(e) =>
                                setUserData({
                                    ...userData,
                                    homeData: {
                                        ...userData.homeData,
                                        cep: e.target.value,
                                    },
                                })
                            } />
                        </div>
                        <div>
                            <div className={styles.add2}>
                                <p>Endereço</p>
                                <input type="text" value={userData.homeData.endereco} onChange={(e) =>
                                    setUserData({
                                        ...userData,
                                        homeData: {
                                            ...userData.homeData,
                                            endereco: e.target.value,
                                        },
                                    })
                                } required />
                            </div>
                            <div className={styles.add2}>
                                <p>Número</p>
                                <input type="number" value={userData.homeData.numero} onChange={(e) =>
                                    setUserData({
                                        ...userData,
                                        homeData: {
                                            ...userData.homeData,
                                            numero: e.target.value,
                                        },
                                    })
                                } required />
                            </div>
                            <div className={styles.add2}>
                                <p>Bairro</p>
                                <input type="text" value={userData.homeData.bairro} onChange={(e) =>
                                    setUserData({
                                        ...userData,
                                        homeData: {
                                            ...userData.homeData,
                                            bairro: e.target.value,
                                        },
                                    })
                                } required />
                            </div>
                            <div className={styles.add2}>
                                <p>Cidade</p>
                                <input type="text" value={userData.homeData.cidade} onChange={(e) =>
                                    setUserData({
                                        ...userData,
                                        homeData: {
                                            ...userData.homeData,
                                            cidade: e.target.value,
                                        },
                                    })
                                } required />
                            </div>
                            <div className={styles.add2}>
                                <p>Estado</p>
                                <input type="text" value={userData.homeData.estado} onChange={(e) =>
                                    setUserData({
                                        ...userData,
                                        homeData: {
                                            ...userData.homeData,
                                            estado: e.target.value,
                                        },
                                    })
                                } required />
                            </div>
                        </div>
                        <div className={styles.add2}>
                            <button onClick={editDoc}>Atualizar</button>
                        </div>
                        <div className={styles.remove}>
                            <button onClick={DeleteHome}>Remover casa</button>
                        </div>
                    </div>





                </div>
            </div>


        </div>
    )
}