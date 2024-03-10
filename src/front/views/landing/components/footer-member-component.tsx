import type {NextPage} from "next"
import {useMemo, type CSSProperties} from "react"
import styles from "./footer-member-component.module.css"
import ButtonImg, {BtnLogoType} from "@/front/components/button-img"

export type FrameComponent1Type = {
    name: string
    title: string
    logo1?: BtnLogoType
    logo2?: BtnLogoType
    logo3?: BtnLogoType
    /** Style props */
    propFlex?: CSSProperties["flex"]
    propMinWidth?: CSSProperties["minWidth"]
};

const FooterMemberComponent: NextPage<FrameComponent1Type> = ({
                                                                  name,
                                                                  title,
                                                                  logo1,
                                                                  logo2,
                                                                  logo3,
                                                                  propFlex,
                                                                  propMinWidth,
                                                              }) => {
    const frameDiv2Style: CSSProperties = useMemo(() => {
        return {
            flex: propFlex,
            minWidth: propMinWidth,
        };
    }, [propFlex, propMinWidth]);

    return (
        <div className={styles.frameParent} style={frameDiv2Style}>
            <div className={styles.memberParent}>
                <div className={styles.memberName}>{name}</div>
                <div className={styles.memberTitle}>{title}</div>
            </div>
            <div className={styles.iconsParent}>
                {logo1 && <ButtonImg img={logo1.img} redirection={logo1.redirection} className={styles.icon}/>}
                {logo2 && <ButtonImg img={logo2.img} redirection={logo2.redirection} className={styles.icon}/>}
                {logo3 && <ButtonImg img={logo3.img} redirection={logo3.redirection} className={styles.icon}/>}
            </div>
        </div>
    );
};

export default FooterMemberComponent;
