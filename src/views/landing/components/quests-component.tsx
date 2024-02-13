import type {NextPage} from "next"
import QuestComponent from "./quest-component"
import styles from "./quests-component.module.css"

const QuestsComponent: NextPage = () => {
    return (
        <section className={styles.completeChallengesParent}>
            <h1 className={styles.completeChallenges}>Complete challenges</h1>
            <div className={styles.frameParent}>
                <QuestComponent
                    img="/quest1-img.png"
                    text="Win streak"
                />
                <QuestComponent
                    img="/quest2-img.png"
                    text="Lose streak"
                />
                <QuestComponent
                    img="/quest3-img.png"
                    text="Beat win streak"
                />
                <QuestComponent
                    img="/quest4-img.png"
                    text="Earn a lot"
                />
            </div>
        </section>
    );
};

export default QuestsComponent;
