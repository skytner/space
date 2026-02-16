import { Fragment } from "react";
import type { SidebarLinkProps } from "../types/sidebar";
import { SidebarLinkItem } from "./SidebarLinkItem";
import styles from "../styles/SidebarLinkList.module.css";

type SidebarLinkListProps = {
    links: SidebarLinkProps[];
    currentPathname: string;
};

export function SidebarLinkList({ links, currentPathname }: SidebarLinkListProps) {
    let lastSection: string | undefined;
    return (
        <nav className={styles.nav} aria-label="Sidebar">
            <ul className={styles.list}>
                {links.map((link) => {
                    const sectionHeader =
                        link.section && link.section !== lastSection ? (
                            <li key={`section-${link.section}`} className={styles.section}>
                                <span className={styles.sectionTitle}>{link.section}</span>
                            </li>
                        ) : null;
                    if (link.section) lastSection = link.section;
                    const isActive =
                        currentPathname === link.href ||
                        (link.href !== "/" && currentPathname.startsWith(link.href));
                    return (
                        <Fragment key={link.href}>
                            {sectionHeader}
                            <li>
                                <SidebarLinkItem {...link} active={isActive} />
                            </li>
                        </Fragment>
                    );
                })}
            </ul>
        </nav>
    );
}
