"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import type { SidebarLinkProps } from "../types/sidebar";
import { SidebarLinkList } from "../components/SidebarLinkList";
import styles from "../styles/SidebarWidget.module.css";
import { Settings2Icon } from "lucide-react";

type SidebarWidgetProps = {
    links: SidebarLinkProps[];
    logoText?: string | ReactNode;
};

export function SidebarWidget({ links, logoText = "Space" }: SidebarWidgetProps) {
    const pathname = usePathname();
    return (
        <aside className={styles.sidebar} role="complementary">
            <div className={styles.header}>
                <span className={styles.logoText}>{logoText}</span>
            </div>
            <SidebarLinkList links={links} currentPathname={pathname} />
            <div className={styles.footer}>
                <button type="button" className={styles.iconButton} aria-label="Settings button">
                    <Settings2Icon />
                </button>
            </div>
        </aside>
    );
}
