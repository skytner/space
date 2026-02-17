"use client";

import { forwardRef, type ReactNode, type CSSProperties, ButtonHTMLAttributes, AriaRole, AriaAttributes } from "react";

export type IconButtonSize = "sm" | "md" | "lg";

const sizeMap = {
    sm: 32,
    md: 40,
    lg: 48,
} as const;

const layoutStyle: CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 0,
};

const defaultAppearanceStyle: CSSProperties = {
    border: "1px solid var(--icon-button-border, rgba(0,0,0,0.1))",
    borderRadius: 8,
    background: "transparent",
    color: "var(--icon-button-color, inherit)",
    cursor: "pointer",
    transition: "background 0.2s ease, border-color 0.2s ease",
};

export type IconButtonProps = {
    icon: ReactNode;
    onClick?: () => void;
    disabled?: boolean;
    size?: IconButtonSize;
    className?: string;
    style?: CSSProperties;
    ariaAttributes?: AriaAttributes;
};

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
    function IconButton(
        {
            icon,
            onClick,
            disabled = false,
            size = "md",
            className,
            style,
            ariaAttributes
        },
        ref
    ) {
        const px = sizeMap[size];
        const inlineStyle: CSSProperties = {
            ...layoutStyle,
            width: px,
            height: px,
            ...(className ? {} : defaultAppearanceStyle),
            cursor: disabled ? "not-allowed" : (className ? undefined : "pointer"),
            opacity: disabled ? 0.5 : (className ? undefined : 1),
            ...style,
        };
        return (
            <button
                ref={ref}
                type="button"
                className={className}
                disabled={disabled}
                onClick={onClick}
                style={inlineStyle}
                {...ariaAttributes}
            >
                {icon}
            </button>
        );
    }
);
