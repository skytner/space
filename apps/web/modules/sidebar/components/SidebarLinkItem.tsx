import Link from "next/link";
import type { SidebarLinkProps } from "../types/sidebar";
import styles from "../styles/SidebarLinkItem.module.css";

export function SidebarLinkItem({ href, label, icon, active }: SidebarLinkProps) {
    return (
        <Link
            href={href}
            className={styles.link}
            data-active={active ?? false}
            aria-current={active ? "page" : undefined}
        >
            <span className={styles.icon} aria-hidden>
                {icon}
            </span>
            <span className={styles.label}>{label}</span>
        </Link>
    );
}
