'use client'

import {ReactNode, useRef} from 'react';

export type ScrollLinkType = {
    children: ReactNode;
    target: string;
    className?: string;
};

const ScrollLink = ({children, target, className}: ScrollLinkType) => {
    const targetRef = useRef<any>(null);

    const handleClick = () => {
        targetRef.current?.scrollIntoView({behavior: 'smooth'});
    };

    return (
        <div onClick={handleClick} className={className}>
            {children}
            <div id={target} ref={targetRef}></div>
        </div>
    );
};

export default ScrollLink;