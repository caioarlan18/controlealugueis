import styles from './Header.module.css'
import { FiMenu } from 'react-icons/fi';
import logo from '../../images/logotipo.png'
import { HashRouter as Router, Route, Routes, Link } from 'react-router-dom';

export function Header({ page }) {

    function abrir() {
        var nv = document.querySelector(`.${styles.mn}`)
        nv.classList.toggle(styles.open)
    }


    return (
        <div>
            <div className={styles.menuMobile}>
                {/* menu mobile */}
                <header className={styles.hd}>
                    <div className={styles.hd1}>
                        <FiMenu onClick={abrir} />
                    </div>
                    <div className={styles.hd1}>
                        <h1>{page}</h1>
                    </div>
                    <div className={styles.hd1}>
                        <Link to={'/'}><img src={logo} alt="logotipo do site" /></Link>
                    </div>
                </header>

                {/* menu mobile */}

                <nav className={styles.mn}>
                    <div className={styles.mn1}>
                        <Link to={'/'}>Home</Link>
                    </div>
                    <div className={styles.mn1}>
                        <Link to={'/seehome'}>Gerenciar casas</Link>
                    </div>
                    <div className={styles.mn1}>
                        <Link to={'/addhome'}>Adicionar casas</Link>
                    </div>

                </nav>
            </div>

            {/* menu desktop */}
            <div className={styles.menuDesktop}>
                <header className={styles.hd}>
                    <div className={styles.hd1}>
                        <Link to={'/'}><img src={logo} alt="logotipo do site" /></Link>
                    </div>
                    <div className={styles.hd1}>
                        <Link to={'/'}>Home</Link>
                    </div>
                    <div className={styles.hd1}>
                        <Link to={'/seehome'}>Gerenciar casas</Link>
                    </div>
                    <div className={styles.hd1}>
                        <Link to={'/addhome'}>Adicionar casas</Link>
                    </div>

                </header>
            </div>

        </div>
    )
}