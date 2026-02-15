import styles from '../styles/HomeView.module.css'
import { AnimatedSpaceBackground } from '../components/AnimatedSpaceBackground'
import { HomeLinkCardGrid } from '../components/HomeLinkCardGrid'
import { HomeLinkCards } from '../constants/cards'

export function HomeView() {
    return (
        <>
            <AnimatedSpaceBackground />
            <main className={styles.main}>
                <h1 className={styles.title}>Space</h1>
                <HomeLinkCardGrid cards={HomeLinkCards} />
            </main>
        </>
    )
}