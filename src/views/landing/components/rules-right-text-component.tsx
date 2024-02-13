import type {NextPage} from "next"
import React, {useMemo, type CSSProperties} from "react"
import styles from "./rules-right-text-component.module.css"

export type RulesRightTextComponentType = {
    title: string;
    children: React.ReactNode;

    /** Style props */
    propPadding?: CSSProperties["padding"];
    propMinWidth?: CSSProperties["minWidth"];
};

const RulesRightTextComponent: NextPage<RulesRightTextComponentType> = ({
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
                    <div className={styles.frameBorder}/>
                    <div className={styles.frameParagraphText}>
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RulesRightTextComponent;
