'use client'

import {Button, Modal, ModalBody, ModalContent, ModalHeader, ModalOverlay, Input} from "@chakra-ui/react"
import React, {useState} from "react"
import axios from "axios"

export interface RegisterComponentProps {
    onRegister: () => void
}

const RegisterComponent: React.FC<RegisterComponentProps> = ({onRegister}) => {
    const [username, setUsername] = useState('')

    const register = () => {
        axios.put('/api/me', {
            name: username
        }).then(async (res) => {
            onRegister()
        })
    }

    return (
        <Modal isOpen={true} isCentered={true} onClose={() => {}}>
            <ModalOverlay/>
            <ModalContent>
                <ModalHeader>
                    Set your username
                </ModalHeader>
                <ModalBody>
                    <Input
                        placeholder="Enter your username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <Button onClick={register}>Register</Button>
                </ModalBody>
            </ModalContent>
        </Modal>
    )
}

export default RegisterComponent