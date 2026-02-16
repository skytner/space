import styles from '../styles/HomeLinkCardGrid.module.css'
import type { HomeLinkCardProps } from "../types/card";
import { HomeLinkCard } from './HomeLinkCard'

export function HomeLinkCardGrid({ cards }: { cards: HomeLinkCardProps[] }) {
    return (
        <div className={styles.cardGrid}>
            {cards.map((c) => <HomeLinkCard key={c.link} {...c} />)}
        </div>
    )
}