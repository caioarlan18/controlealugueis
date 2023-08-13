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
    const [homePrice, setHomePrice] = useState('')
    const [dayPayment, setDayPayment] = useState('')
    const [personName, setPersonName] = useState('')
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

    const homeData = {
        imagemURL: imagemURL,
        homeName: homeName,
        homePrice: homePrice,
        dayPayment: dayPayment,
        personName: personName,
        cep: cep,
        endereco: endereco,
        numero: numero,
        bairro: bairro,
        cidade: cidade,
        estado: estado
    }

    async function salvar() {
        if (imagemURL && homeName && homePrice && dayPayment && personName && cep && endereco && numero && bairro && cidade && estado !== '') {
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
                            <input type="text" value={homeName} onChange={(e) => { setHomeName(e.target.value) }} />
                        </div>
                        <div className={styles.add2}>
                            <p>Valor do Aluguel</p>
                            <input type="number" value={homePrice} onChange={(e) => { setHomePrice(e.target.value) }} />
                        </div>
                        <div className={styles.add2}>
                            <p>Dia do pagamento</p>
                            <input type="number" value={dayPayment} onChange={(e) => { setDayPayment(e.target.value) }} />
                        </div>
                        <div className={styles.add2}>
                            <p>Nome do inquilino</p>
                            <input type="text" value={personName} onChange={(e) => { setPersonName(e.target.value) }} />
                        </div>
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