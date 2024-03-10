'use client'

import {ReactNode} from 'react'
import styles from './url-link.module.css'

export type UrlLinkType = {
    children: ReactNode
    redirection: string
};

const UrlLink = ({redirection, children}: UrlLinkType) => {

    return (
        <a href={redirection} target="_blank" rel="noopener noreferrer" className={styles.btnText}>
            {children}
        </a>
    );
};

export default UrlLink