'use client'

import type {NextPage} from "next"
import styles from "./header-component.module.css"
import DisplayWallet from "@/components/wallet/display-wallet"
import UrlLink from "@/components/url-link"
import ButtonText from "@/components/button-text"
import {useRouter} from "next/navigation";

const HeaderComponent: NextPage = () => {
    const router = useRouter()

    function joinMarketplace() {
        router.push('/marketplace')
    }

    return (
        <header className={styles.headerContainer}>
            <img
                className={styles.vectorIcon}
                loading="eager"
                alt=""
                src="/vector.svg"
            />
            <div className={styles.headerParent}>
                <div className={styles.exploreParent}>
                    <ButtonText text={"Rules"} onClick={() => {
                    }}/>
                    <ButtonText text={"Quests"} onClick={() => {
                    }}/>
                    <img className={styles.unionIcon} alt="" src="/union-1.svg"/>
                </div>
                <ButtonText text={"Marketplace"} onClick={joinMarketplace}/>
            </div>
            <DisplayWallet/>
        </header>
    )
}

export default HeaderComponent
