"use client";

import { forwardRef, type ReactNode } from "react";

export type CheckboxProps = {
    checked: boolean;
    onCheckedChange: (checked: boolean) => void;
    disabled?: boolean;
    id?: string;
    children?: ReactNode;
    className?: string;
};

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
    function Checkbox(
        {
            checked,
            onCheckedChange,
            disabled = false,
            id,
            children,
            className,
        },
        ref
    ) {
        return (
            <label
                style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 10,
                    cursor: disabled ? "not-allowed" : "pointer",
                    opacity: disabled ? 0.6 : 1,
                }}
                className={className}
            >
                <input
                    ref={ref}
                    type="checkbox"
                    id={id}
                    checked={checked}
                    disabled={disabled}
                    onChange={(e) => onCheckedChange(e.target.checked)}
                    style={{
                        width: 16,
                        height: 16,
                        margin: 0,
                        accentColor: "var(--checkbox-accent, #1e40af)",
                        cursor: disabled ? "not-allowed" : "pointer",
                    }}
                />
                {children != null && <span style={{ fontSize: 14, fontWeight: 500 }}>{children}</span>}
            </label>
        );
    }
);
