'use client'
import styles from "./game.module.css"
import HeaderComponent from "@/front/views/game/components/header-component"
import Chatbox from "@/front/components/chatbox"
import {
    Flex,
    Box
} from "@chakra-ui/react"
import useSession from "@/front/hooks/session"
import LoginComponent from "@/front/views/game/components/login-component"
import {useState} from "react"
import RegisterComponent from "@/front/views/game/components/register-component";
import {getContract} from "viem";
import {useAccount, useChainId, useWalletClient} from "wagmi";
import contracts from "@/blockchain/contracts";
import useGameContract from "@/front/hooks/useGameContract";

export default function Game() {
    const [refreshKey, setRefreshKey] = useState(0)
    const session = useSession(refreshKey)
    const ticketCost = useGameContract.entranceTicketCost()
    const totalSoul = useGameContract.getTotalSoul()
    console.log('data: ', ticketCost, totalSoul)

    const updateFrame = () => {
        setRefreshKey(prevKey => prevKey + 1)
    }

    if (session && session.name) {
        return (
            <div className={styles.container}>
                <HeaderComponent/>
                <Flex direction="row" width='100%' height='100%'>
                    <Box flex="9">
                        <div className={styles.game}>
                            <h1>Game</h1>
                        </div>
                    </Box>
                    <Box flex="3" width='100%'>
                        <Flex direction="row" backgroundColor='red' height={100}>
                            Stats
                        </Flex>
                        <Flex direction="row" width='100%' height='100%'>
                            <Chatbox/>
                        </Flex>
                    </Box>
                </Flex>
            </div>
        )
    } else {
        return (
            <div className={styles.container}>
                <HeaderComponent/>
                {session && !session.name ? <RegisterComponent onRegister={updateFrame}/> :
                    <LoginComponent onSignIn={updateFrame}/>}
            </div>
        )
    }
}