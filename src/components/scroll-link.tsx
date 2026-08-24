'use client'

import styles from './scroll-link.module.css'
import {useFullPageScroll} from '@/views/landing/components/full-page-scroll'
import {useRouter} from 'next/navigation'

export type ScrollLinkType = {
    children: React.ReactNode
    target: string
    className?: string
    wrapperClassName?: string
};

const HEADER_SCROLL_OFFSET = 170

const ScrollLink = ({children, target, className, wrapperClassName}: ScrollLinkType) => {
    const fullPageScroll = useFullPageScroll()
    const router = useRouter()

    const handleClick = () => {
        if (fullPageScroll) {
            fullPageScroll.scrollToTarget(target)
            return
        }

        const targetElement = document.getElementById(target)
        if (targetElement) {
            const topPosition = targetElement.getBoundingClientRect().top + window.pageYOffset
            window.scrollTo({top: topPosition - HEADER_SCROLL_OFFSET, behavior: 'smooth'})
            return
        }

        router.push(`/#${target}`)
    }

    return (
        <div onClick={handleClick} className={`${styles.scrollLink} ${wrapperClassName ?? ''}`.trim()}>
            <div className={className}>{children}</div>
        </div>
    );
};

export default ScrollLink
