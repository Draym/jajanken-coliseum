import type {NextPage} from "next"
import React, {useMemo, type CSSProperties} from "react"
import styles from "./rules-left-text-component.module.css"

export type RulesLeftTextComponentType = {
    title: string;
    children: React.ReactNode;

    /** Style props */
    propPadding?: CSSProperties["padding"];
    propMinWidth?: CSSProperties["minWidth"];
};

const RulesLeftTextComponent: NextPage<RulesLeftTextComponentType> = ({
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
            <div className={styles.frameParent}>
                <h2 className={styles.frameTitle}>{title}</h2>
                <div className={styles.frameParagraph}>
                    <div className={styles.frameParagraphText}>
                        {children}
                    </div>
                    <div className={styles.frameBorder}/>
                </div>
            </div>
        </div>
    );
};

export default RulesLeftTextComponent;
