import type { ReactNode } from "react";

export type SidebarLinkProps = {
    href: string;
    label: string;
    icon: ReactNode;
    active?: boolean;
    section?: string;
};