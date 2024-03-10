import styles from "./game.module.css"
import HeaderComponent from "@/front/views/game/components/header-component"
import Chatbox from "@/front/components/chatbox";
import {Box, Flex} from "@chakra-ui/react";

export default function Game() {
    return (
        <div className={styles.container}>
            <HeaderComponent/>
            <Flex direction="row" width='100%' height='100%'>
                <Box flex="9">
                    <div className={styles.game}>
                        <h1>Game</h1>
                    </div>
                </Box>
                <Box flex="3" width='100%' >
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
}