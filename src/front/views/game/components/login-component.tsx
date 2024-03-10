'use client'
import {
    Button,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody
} from "@chakra-ui/react"
import React, {useEffect, useState} from "react"
import axios from "axios"
import {ChallengeDTO} from "@/server/dtos/login.dto"
import {SiweMessage} from "siwe";
import {useAccount, useChainId, useSignMessage} from "wagmi";
import {ConnectButton} from "@rainbow-me/rainbowkit";

export interface LoginComponentProps {
    onSignIn: () => void
}

function createSiweMessage(address: string, statement: string, nonce: string, chainId: number) {
    const message = new SiweMessage({
        domain: window.location.host,
        address,
        statement,
        uri: window.location.origin,
        version: '1',
        chainId,
        nonce
    });
    return message.prepareMessage();
}

const LoginComponent: React.FC<LoginComponentProps> = ({onSignIn}) => {
    const {address} = useAccount()
    const chainId = useChainId();
    const {signMessageAsync} = useSignMessage()

    const [challenge, setChallenge] = useState<ChallengeDTO | null>(null)

    useEffect(() => {
        axios.get('/api/auth/login').then(async (res) => {
            setChallenge(res.data)
        })
    }, [])

    const signIn = () => {
        if (!challenge) return console.error('No challenge')
        if (!address) return console.error('No address')
        const siweMessage = createSiweMessage(address, challenge.message, challenge.nonce, chainId)
        signMessageAsync({
            message: siweMessage,
        }).then((signature) => {
            axios.post('/api/auth/login', {
                address,
                message: siweMessage,
                nonce: challenge.nonce,
                signature
            }).then(async (res) => {
                onSignIn()
            })
        })
    }

    return (
        <Modal isOpen={true} isCentered={true} onClose={() => {
            console.log('close modal?')
        }}>
            <ModalOverlay/>
            <ModalContent>
                <ModalHeader>
                    {challenge ? challenge.message : 'Loading..'}
                </ModalHeader>
                <ModalBody>
                    {
                        address ? <Button colorScheme="blue" disabled={!challenge} onClick={signIn}>Login</Button> :
                            <ConnectButton/>
                    }
                </ModalBody>
            </ModalContent>
        </Modal>
    )
}

export default LoginComponent