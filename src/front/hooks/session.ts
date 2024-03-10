import {useEffect, useState} from "react"
import {UserDTO} from "@/server/dtos/user.dto"
import axios from "axios";

export default function useSession() {
    const [session, setSession] = useState<UserDTO | null>(null)

    useEffect(() => {
        axios.get('/api/auth/me').then(async (res) => {
            setSession(res.data)
        }).catch(e => {
            console.error(e)
            setSession(null)
        })
    }, []);

    return session
}