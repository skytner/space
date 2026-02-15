"use client";

import { useLayoutEffect, useRef } from "react";
import type { ReactNode } from "react";

export type Option = { value: string; label: ReactNode; disabled?: boolean };

export type Props<T extends string = string> = {
    value: T;
    onValueChange: (v: T) => void;
    options: Option[];
    "aria-label"?: string;
    className?: string;
};

export default function ToggleButton<T extends string = string>({
    value,
    onValueChange,
    options,
    "aria-label": ariaLabel = "Toggle",
    className,
}: Props<T>) {
    const selectedRef = useRef<HTMLButtonElement>(null);
    const indicatorRef = useRef<HTMLDivElement>(null);

    useLayoutEffect(() => {
        const btn = selectedRef.current;
        const pill = indicatorRef.current;
        if (btn && pill) {
            pill.style.left = `${btn.offsetLeft}px`;
            pill.style.width = `${btn.offsetWidth}px`;
        }
    }, [value]);

    return (
        <div
            role="group"
            aria-label={ariaLabel}
            className={className}
            style={{
                display: "inline-flex",
                position: "relative",
                borderRadius: 8,
                padding: 2,
                background: "var(--toggle-bg, rgba(0,0,0,.06))",
                gap: 0,
            }}
        >
            <div
                ref={indicatorRef}
                aria-hidden
                style={{
                    position: "absolute",
                    top: 2,
                    left: 0,
                    height: "calc(100% - 4px)",
                    width: 0,
                    borderRadius: 6,
                    background: "var(--toggle-selected-bg, #fff)",
                    boxShadow: "0 1px 2px rgba(0,0,0,.06)",
                    pointerEvents: "none",
                    transition: "left 0.2s ease, width 0.2s ease",
                }}
            />
            {options.map((opt) => {
                const isSelected = value === opt.value;
                return (
                    <button
                        key={opt.value}
                        ref={isSelected ? selectedRef : undefined}
                        type="button"
                        role="tab"
                        aria-selected={isSelected}
                        aria-disabled={opt.disabled}
                        disabled={opt.disabled}
                        onClick={() => !opt.disabled && onValueChange(opt.value as T)}
                        style={{
                            position: "relative",
                            zIndex: 1,
                            padding: "6px 14px",
                            border: "none",
                            borderRadius: 6,
                            cursor: opt.disabled ? "not-allowed" : "pointer",
                            fontWeight: 500,
                            fontSize: 14,
                            background: "transparent",
                            color: opt.disabled
                                ? "var(--toggle-disabled-color, #999)"
                                : "var(--toggle-color, inherit)",
                            transition: "color 0.2s ease",
                        }}
                    >
                        {opt.label}
                    </button>
                );
            })}
        </div>
    );
}