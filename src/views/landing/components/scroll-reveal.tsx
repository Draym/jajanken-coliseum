'use client'

import {motion, useInView} from 'framer-motion'
import {ReactNode, useRef} from 'react'

type ScrollRevealProps = {
    children: ReactNode
    from?: 'left' | 'right'
    className?: string
    delay?: number
}

const EASE = [0.22, 1, 0.36, 1] as const

export default function ScrollReveal({children, from = 'left', className, delay = 0}: ScrollRevealProps) {
    const ref = useRef<HTMLDivElement>(null)
    const isInView = useInView(ref, {
        amount: 0.25,
        margin: '0px 0px -10% 0px',
    })
    const x = from === 'left' ? -72 : 72

    return (
        <motion.div
            ref={ref}
            className={className}
            initial={false}
            animate={isInView ? {opacity: 1, x: 0} : {opacity: 0, x}}
            transition={{duration: 0.85, ease: EASE, delay: isInView ? delay : 0}}
        >
            {children}
        </motion.div>
    )
}
