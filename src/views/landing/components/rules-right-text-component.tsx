import type {NextPage} from "next"
import React, {useMemo, type CSSProperties} from "react"
import styles from "./rules-left-text-component.module.css"

export type FrameComponent5Type = {
    title: string;
    children: React.ReactNode;

    /** Style props */
    propPadding?: CSSProperties["padding"];
    propMinWidth?: CSSProperties["minWidth"];
};

const RulesLeftTextComponent: NextPage<FrameComponent5Type> = ({
                                                                   title,
                                                                   children,
                                                                   propPadding,
                                                                   propMinWidth,
                                                               }) => {
    const frameDivStyle: CSSProperties = useMemo(() => {
        return {
            padding: propPadding,
            minWidth: propMinWidth,
        };
    }, [propPadding, propMinWidth]);

    return (
        <div className={styles.frameWrapper} style={frameDivStyle}>
            <div className={styles.outsmartYourLuckParent}>
                <h2 className={styles.outsmartYourLuck}>{title}</h2>
                <div className={styles.inTheEndlessBattleRoyaleAParent}>
                    <div className={styles.inTheEndlessContainer}>
                        {children}
                    </div>
                    <div className={styles.frameChild}/>
                </div>
            </div>
        </div>
    );
};

export default RulesLeftTextComponent;
