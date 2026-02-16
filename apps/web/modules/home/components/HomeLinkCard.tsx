import Link from 'next/link'
import styles from '../styles/HomeLinkCard.module.css'
import type { HomeLinkCardProps } from "../types/card";

export function HomeLinkCard({ title, link, linkName, description, strIcon }: HomeLinkCardProps) {
    return (
        <article className={styles.card}>
            <div className={styles.cardHeader}>
                <span className={styles.cardIcon} aria-hidden>
                    {strIcon}
                </span>
                <h2 className={styles.cardTitle}>{title}</h2>
            </div>
            <p className={styles.cardDescription}>
                {description}
            </p>
            <Link href={link} className={styles.cardAction}>
                {linkName}
            </Link>
        </article>
    )
}