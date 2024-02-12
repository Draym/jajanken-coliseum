'use client'

import {ReactNode} from 'react'
import styles from './scroll-link.module.css'

export type ScrollLinkType = {
    children: ReactNode
    target: string
    className?: string
};

const ScrollLink = ({children, target, className}: ScrollLinkType) => {
    const handleClick = () => {
        const targetElement = document.getElementById(target);
        if (targetElement) {
            const topPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
            window.scrollTo({top: topPosition - 170, behavior: 'smooth'});
        }
    };

    return (
        <div onClick={handleClick} className={styles.scrollLink}>
            <div className={className}>{children}</div>
        </div>
    );
};

export default ScrollLink