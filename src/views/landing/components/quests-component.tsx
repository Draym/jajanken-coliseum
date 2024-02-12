import type {NextPage} from "next"
import QuestComponent from "./quest-component"
import styles from "./quests-component.module.css"

const QuestsComponent: NextPage = () => {
    return (
        <section className={styles.completeChallengesParent}>
            <h1 className={styles.completeChallenges}>Complete challenges</h1>
            <div className={styles.frameParent}>
                <QuestComponent
                    img="/rectangle-20-1@2x.png"
                    text="Win streak"
                />
                <QuestComponent
                    img="/rectangle-20-2@2x.png"
                    text="Lose streak"
                    propMargin="0"
                />
                <QuestComponent
                    img="/rectangle-20-3@2x.png"
                    text="Beat win streak"
                    propMargin="0"
                />
                <QuestComponent
                    img="/rectangle-20-4@2x.png"
                    text="Earn a lot"
                    propMargin="0"
                />
            </div>
        </section>
    );
};

export default QuestsComponent;
