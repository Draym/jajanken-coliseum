import React from 'react'
import styles from './button-1.module.css'

interface ImageButtonProps {
    altText: string
    onClick: () => void
}

const Button1: React.FC<ImageButtonProps> = ({altText, onClick}) => {
    return (
        <button className={styles.btn} onClick={onClick} style={{ backgroundImage: `url(/btnbg@2x.png)`}} aria-label={altText}>
            <div className={styles.btnTextParent}>
                <b className={styles.btnText}>{altText}</b>
            </div>
        </button>
    );
};

export default Button1