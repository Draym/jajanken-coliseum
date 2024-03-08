import React from 'react'
import styles from './button-green.module.css'

interface ButtonGreenProps {
    text: string
    onClick: () => void
}

const ButtonGreen: React.FC<ButtonGreenProps> = ({text, onClick}) => {
    return (
        <button className={styles.btn} onClick={onClick} style={{ backgroundImage: `url(/btnbg@2x.png)`}} aria-label={text}>
            <div className={styles.btnTextParent}>
                <b className={styles.btnText}>{text}</b>
            </div>
        </button>
    );
};

export default ButtonGreen