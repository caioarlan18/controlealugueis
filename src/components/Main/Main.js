import bannerPrincipalMobile from '../../images/banner-principal.png'
import styles from './Main.module.css'
import { HashRouter as Router, Route, Routes, Link } from 'react-router-dom';
import bannerPrincipalDesktop from '../../images/banner principal desktop.png'
export function Main() {
    return (
        <div className={styles.main}>
            <div className={styles.mainMobile}>
                <Link to={'/seehome'}><img src={bannerPrincipalMobile} alt="banner principal do site" /></Link>
            </div>
            <div className={styles.mainDesktop}>
                <Link to={'/seehome'}> <img src={bannerPrincipalDesktop} alt="banner principal do site" /> </Link>
            </div>

        </div>
    )
}