import bannerPrincipal from '../../images/banner-principal.png'
import styles from './Main.module.css'
import { HashRouter as Router, Route, Routes, Link } from 'react-router-dom';

export function Main() {
    return (
        <div className={styles.main}>
            <Link to={'/seehome'}><img src={bannerPrincipal} alt="banner principal do site" /></Link>
        </div>
    )
}