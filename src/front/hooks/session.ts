import {useEffect, useState} from "react"
import {UserDTO} from "@/server/dtos/user.dto"
import axios from "axios";


export default function useSession(refreshKey: number) {
    const [session, setSession] = useState<UserDTO | null>(null)

    useEffect(() => {
        console.log('fetching session')
        axios.get('/api/me').then(async (res) => {
            console.log('result:', res.data)
            setSession(res.data)
        }).catch(e => {
            console.error(e)
            setSession(null)
        })
    }, [refreshKey]);

    return session
}