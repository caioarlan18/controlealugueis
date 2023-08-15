import styles from './AddHome.module.css'
import { Header } from '../Header/Header'
import { useState } from 'react'
import axios from 'axios'
import { useEffect } from 'react'
import { initializeApp } from "firebase/app";
import { collection, getFirestore, getDocs, addDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage'

export function AddHome() {

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


    const [homeName, setHomeName] = useState('')
    const [isLeased, setIsLeased] = useState('não')
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
    const [selectedOption, setSelectedOption] = useState('sim');
    const [status, setStatus] = useState('')


    const homeData = {
        imagemURL: imagemURL,
        homeName: homeName,
        isLeased: isLeased,
        homePrice: homePrice,
        dayPayment: dayPayment,
        paid: selectedOption,
        personName: personName,
        personNumber: personNumber,
        waterNumber: waterNumber,
        lightNumber: lightNumber,
        startContractDate: startContractDate,
        contractTime: contractTime,
        dayFees: dayFees,
        totalFees: totalFees,
        cep: cep,
        endereco: endereco,
        numero: numero,
        bairro: bairro,
        cidade: cidade,
        estado: estado,
    }


    async function salvar() {

        if (isLeased === 'não') {
            if (imagemURL && homeName && cep && endereco && numero && bairro && cidade && estado !== '') {

                const user = await addDoc(useCollectionRef, {
                    homeData
                })
                console.log(user)
                alert('Sua casa foi criado com sucesso')
                setImagemURL('')
                setHomeName('')
                setHomePrice('')
                setDayPayment('')
                setPersonName('')
                setPersonNumber('')
                setWaterNumber('')
                setLightNumber('')
                setStartContractDate('')
                setContractTime('')
                setDayFees('')
                setTotalFees('')
                setCep('')
                setEndereco('')
                setNumero('')
                setBairro('')
                setCidade('')
                setEstado('')
            } else {
                alert('Existem campos vazios')
            }

        } else {
            if (imagemURL && homeName && homePrice && dayPayment && personName && personNumber && waterNumber && lightNumber && startContractDate && contractTime && dayFees && totalFees && cep && endereco && numero && bairro && cidade && estado !== '') {

                const user = await addDoc(useCollectionRef, {
                    homeData
                })
                console.log(user)
                alert('Sua casa foi criado com sucesso')
                setImagemURL('')
                setHomeName('')
                setHomePrice('')
                setDayPayment('')
                setPersonName('')
                setPersonNumber('')
                setWaterNumber('')
                setLightNumber('')
                setStartContractDate('')
                setContractTime('')
                setDayFees('')
                setTotalFees('')
                setCep('')
                setEndereco('')
                setNumero('')
                setBairro('')
                setCidade('')
                setEstado('')
            } else {
                alert('existem campos vazios')
            }

        }


    }





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
        event.preventDefault()
        const file = event.target.files[0];
        const storageRef = ref(storage, `images/${file.name}`)
        const uploadTask = uploadBytesResumable(storageRef, file)
        uploadTask.on(
            "state_changed",
            snapshot => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                setProgress(progress)
            },
            error => {
                alert(error)
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then(url => {
                    setImagemURL(url)
                })
            }
        )
    };

    const handleRemoveImagem = () => {
        if (imagemURL) {
            // Extrai o nome do arquivo da URL


            // Obtém a referência do arquivo no Firebase Storage
            const imageRef = ref(storage, imagemURL);

            // Remove o arquivo do Firebase Storage
            deleteObject(imageRef)
                .then(() => {
                    console.log('Arquivo removido com sucesso do Firebase Storage');
                    setImagemURL('');
                })
                .catch((error) => {
                    console.error('Erro ao remover o arquivo:', error);
                });
        }
    };
    return (
        <div>
            <Header page={'Adicionar casa'} />
            <div className={styles.add}>
                <div className={styles.add1}>
                    <h1>Informações da casa</h1>
                </div>
                <div className={styles.add1}>
                    <div className={styles.pc}>
                        <div className={styles.add2img}>
                            <p>Imagem da casa</p>
                            <input type="file" accept="image/*" onChange={handleImagemChange} />
                            {imagemURL &&
                                <div className={styles.upimg}>
                                    <div>
                                        {imagemURL && <img src={imagemURL} alt="Imagem Carregada" />}
                                    </div>

                                    <div>
                                        <button onClick={handleRemoveImagem}>Remover Imagem</button>
                                    </div>

                                </div>
                            }


                        </div>
                    </div>
                    <div className={styles.pc2}>
                        <div className={styles.add2}>
                            <p>Nome da casa</p>
                            <input type="text" value={homeName} onChange={(e) => { setHomeName(e.target.value) }} placeholder='exemplo: casa3' />
                        </div>
                        <div className={styles.add2}>
                            <p>Está alugada?</p>
                            <select value={isLeased} onChange={(e) => { setIsLeased(e.target.value) }} >
                                <option value="não">Não</option>
                                <option value="sim">Sim</option>
                            </select>
                        </div>
                        {isLeased === 'sim' &&
                            <div>
                                <div className={styles.add2}>
                                    <p>Valor do Aluguel</p>
                                    <input type="number" value={homePrice} onChange={(e) => { setHomePrice(e.target.value) }} />
                                </div>
                                <div className={styles.add2}>
                                    <p>Dia do pagamento do aluguel</p>
                                    <input type="number" value={dayPayment} onChange={(e) => { setDayPayment(e.target.value) }} min={1}
                                        max={30} placeholder='exemplo: 20' />
                                </div>
                                <div className={styles.add2}>
                                    <p>Já pagou?</p>
                                    <select value={selectedOption} onChange={(e) => { setSelectedOption(e.target.value) }} >
                                        <option value="sim">Sim</option>
                                        <option value="não">Não</option>
                                    </select>
                                </div>
                                <div className={styles.add2}>
                                    <p>Nome do inquilino</p>
                                    <input type="text" value={personName} onChange={(e) => { setPersonName(e.target.value) }} placeholder='exemplo: pedro silva' />
                                </div>
                                <div className={styles.add2}>
                                    <p>Número do inquilino</p>
                                    <input type="text" value={personNumber} onChange={(e) => { setPersonNumber(e.target.value) }} placeholder='exemplo: 999999999' />
                                </div>
                                <div className={styles.add2}>
                                    <p>Número da matrícula da água</p>
                                    <input type="text" value={waterNumber} onChange={(e) => { setWaterNumber(e.target.value) }} />
                                </div>
                                <div className={styles.add2}>
                                    <p>Número da matrícula da luz</p>
                                    <input type="text" value={lightNumber} onChange={(e) => { setLightNumber(e.target.value) }} />
                                </div>
                                <div className={styles.add2}>
                                    <p>Data de início do contrato</p>
                                    <input type="date" value={startContractDate} onChange={(e) => { setStartContractDate(e.target.value) }} />
                                </div>

                                <div className={styles.add2}>
                                    <p>Tempo do contrato (em meses)</p>
                                    <input type="number" value={contractTime} onChange={(e) => { setContractTime(e.target.value) }} placeholder='exemplo: 12' />
                                </div>
                                <div className={styles.add2}>
                                    <p>Juros por dia (em %)</p>
                                    <input type="number" value={dayFees} onChange={(e) => { setDayFees(e.target.value) }} placeholder='exemplo: 2' />
                                </div>
                                <div className={styles.add2}>
                                    <p>Juros sob o valor total (em %)</p>
                                    <input type="number" value={totalFees} onChange={(e) => { setTotalFees(e.target.value) }} placeholder='exemplo: 10' />
                                </div>
                            </div>
                        }

                        <div className={styles.add2}>
                            <p>CEP {erroCEP && <span style={{ color: 'red' }}>(CEP inválido)</span>}</p>
                            <input type="number" value={cep} onChange={(e) => { setCep(e.target.value) }} />
                        </div>
                        {mostrarCampos && <div>
                            <div className={styles.add2}>
                                <p>Endereço</p>
                                <input type="text" value={endereco} onChange={(e) => { setEndereco(e.target.value) }} required />
                            </div>
                            <div className={styles.add2}>
                                <p>Número</p>
                                <input type="number" value={numero} onChange={(e) => { setNumero(e.target.value) }} required />
                            </div>
                            <div className={styles.add2}>
                                <p>Bairro</p>
                                <input type="text" value={bairro} onChange={(e) => { setBairro(e.target.value) }} required />
                            </div>
                            <div className={styles.add2}>
                                <p>Cidade</p>
                                <input type="text" value={cidade} onChange={(e) => { setCidade(e.target.value) }} required />
                            </div>
                            <div className={styles.add2}>
                                <p>Estado</p>
                                <input type="text" value={estado} onChange={(e) => { setEstado(e.target.value) }} required />
                            </div>
                        </div>}
                        <div className={styles.add2}>
                            <button onClick={salvar}>Salvar</button>
                        </div>
                    </div>





                </div>
            </div>
        </div>
    )
}