import React from 'react'
import styles from './button-green.module.css'

interface ButtonTextProps {
    text: string
    onClick: () => void
}

const ButtonText: React.FC<ButtonTextProps> = ({text, onClick}) => {
    return (
        <div className={styles.btn} onClick={onClick} aria-label={text}>
            <div className={styles.btnTextParent}>
                <b className={styles.btnText}>{text}</b>
            </div>
        </div>
    );
};

export default ButtonText