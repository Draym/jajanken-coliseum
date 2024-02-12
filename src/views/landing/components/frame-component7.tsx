import type { NextPage } from "next"
import { useMemo, type CSSProperties } from "react"
import styles from "./frame-component7.module.css"

export type FrameComponent4Type = {
  rectangle19?: string;
  anubis?: string;
  v7L?: string;
  prop?: string;
  prop1?: string;

  /** Style props */
  propBottom?: CSSProperties["bottom"];
  propLeft?: CSSProperties["left"];
  propMargin?: CSSProperties["margin"];
  propPosition?: CSSProperties["position"];
  propBackgroundColor?: CSSProperties["backgroundColor"];
  propBorder?: CSSProperties["border"];
  propBoxShadow?: CSSProperties["boxShadow"];
};

const FrameComponent4: NextPage<FrameComponent4Type> = ({
  rectangle19,
  anubis,
  v7L,
  prop,
  prop1,
  propBottom,
  propLeft,
  propMargin,
  propPosition,
  propBackgroundColor,
  propBorder,
  propBoxShadow,
}) => {
  const frameDiv1Style: CSSProperties = useMemo(() => {
    return {
      bottom: propBottom,
      left: propLeft,
      margin: propMargin,
      position: propPosition,
      backgroundColor: propBackgroundColor,
      border: propBorder,
      boxShadow: propBoxShadow,
    };
  }, [
    propBottom,
    propLeft,
    propMargin,
    propPosition,
    propBackgroundColor,
    propBorder,
    propBoxShadow,
  ]);

  return (
    <div className={styles.frameParent} style={frameDiv1Style}>
      <div className={styles.rectangleParent}>
        <img className={styles.frameChild} alt="" src={rectangle19} />
        <div className={styles.anubisParent}>
          <h3 className={styles.anubis}>{anubis}</h3>
          <div className={styles.v7l}>{v7L}</div>
        </div>
      </div>
      <div className={styles.frameGroup}>
        <div className={styles.parent}>
          <div className={styles.div}>{prop}</div>
          <img className={styles.image5Icon} alt="" src="/image-5@2x.png" />
        </div>
        <div className={styles.group}>
          <div className={styles.div1}>{prop1}</div>
          <img className={styles.image5Icon1} alt="" src="/image-5-1@2x.png" />
        </div>
        <div className={styles.container}>
          <div className={styles.div2}>3</div>
          <img className={styles.image5Icon2} alt="" src="/image-5-2@2x.png" />
        </div>
      </div>
    </div>
  );
};

export default FrameComponent4;
