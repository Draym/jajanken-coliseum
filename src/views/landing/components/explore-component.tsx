import styles from "./exlpore-component.module.css"

const ExploreComponent = () => {
    return (
        <div>
            <img
                className={styles.exploreSoulImg}
                loading="eager"
                alt=""
                src="/image-16@2x.png"
            />
            <div className={styles.frameWrapper}>
                <div className={styles.rectangleParent}>
                    <img
                        className={styles.rectangleIcon}
                        loading="eager"
                        alt=""
                        src="/rectangle-20@2x.png"
                    />
                    <div className={styles.findFortuneOrDieParent}>
                        <h2 className={styles.findFortuneOr}>Find fortune... or die</h2>
                        <div className={styles.loremIpsumDolor}>
                            Lorem ipsum dolor sit amet consectetur. Velit lacus nulla
                            neque in id senectus. Libero blandit orci in elementum sit
                            cras egestas quam. Nulla vivamus amet integer molestie arcu.
                            Nunc quis semper scelerisque id. Egestas pellentesque odio
                            justo condimentum sagittis. Sit at faucibus lectus at elit
                            pharetra etiam posuere sed. Sapien euismod cursus accumsan
                            tristique mauris augue gravida sed vel. Dolor nisi mauris
                            placerat euismod donec. Augue tempus dignissim facilisi
                            interdum.
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default ExploreComponent