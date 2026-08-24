'use client'

import styles from "./see-more-trigger.module.css"
import {useFullPageScroll} from "@/views/landing/components/full-page-scroll"

type SeeMoreTriggerProps = {
    className?: string
}

export default function SeeMoreTrigger({className}: SeeMoreTriggerProps) {
    const fullPageScroll = useFullPageScroll()

    return (
        <button
            type="button"
            className={`${styles.seeMoreParent} ${className ?? ''}`.trim()}
            onClick={() => fullPageScroll?.scrollToTarget('how-to-play')}
            aria-label="See more about how to play"
        >
            <span className={styles.seeMore}>
                <b>see more</b>
            </span>
            <img
                className={styles.arrowsDiagramsarrowIcon}
                loading="eager"
                alt=""
                src="/arrows-diagramsarrow.svg"
            />
        </button>
    )
}
