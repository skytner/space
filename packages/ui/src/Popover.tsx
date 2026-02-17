"use client";

import { useCallback, useEffect, useRef, type ReactNode, type CSSProperties } from "react";

export type PopoverPlacement = "top" | "bottom" | "left" | "right";

export type PopoverProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    trigger: ReactNode;
    children: ReactNode;
    placement?: PopoverPlacement;
    offset?: number;
    contentClassName?: string;
};

const wrapperStyle: CSSProperties = { position: "relative", display: "inline-block" };

const contentBaseStyle: CSSProperties = {
    zIndex: 50,
    opacity: 0,
    visibility: "hidden",
    pointerEvents: "none",
    transition: "opacity 0.15s ease, transform 0.15s ease, visibility 0.15s ease",
};

const contentLayoutStyle: CSSProperties = {
    ...contentBaseStyle,
    position: "absolute",
};

const contentAppearanceStyle: CSSProperties = {
    minWidth: 120,
    padding: 8,
    borderRadius: 8,
    background: "var(--popover-bg, #fff)",
    border: "1px solid var(--popover-border, rgba(0,0,0,0.1))",
    boxShadow: "var(--popover-shadow, 0 4px 12px rgba(0,0,0,0.15))",
};

const contentVisibleStyle: CSSProperties = {
    opacity: 1,
    visibility: "visible",
    pointerEvents: "auto",
};

function getContentPlacementStyle(
    placement: PopoverPlacement,
    offset: number
): CSSProperties {
    const base: CSSProperties = { ...contentLayoutStyle };
    switch (placement) {
        case "top":
            base.bottom = "100%";
            base.left = "50%";
            base.transform = "translateX(-50%) translateY(-4px)";
            base.marginBottom = offset;
            break;
        case "bottom":
            base.top = "100%";
            base.left = "50%";
            base.transform = "translateX(-50%) translateY(4px)";
            base.marginTop = offset;
            break;
        case "left":
            base.right = "100%";
            base.top = "50%";
            base.transform = "translateY(-50%) translateX(-4px)";
            base.marginRight = offset;
            break;
        case "right":
            base.left = "100%";
            base.top = "50%";
            base.transform = "translateY(-50%) translateX(4px)";
            base.marginLeft = offset;
            break;
    }
    return base;
}

function getContentVisibleTransform(placement: PopoverPlacement): string {
    switch (placement) {
        case "top":
            return "translateX(-50%) translateY(0)";
        case "bottom":
            return "translateX(-50%) translateY(0)";
        case "left":
            return "translateY(-50%) translateX(0)";
        case "right":
            return "translateY(-50%) translateX(0)";
    }
}

export function Popover({
    open,
    onOpenChange,
    trigger,
    children,
    placement = "bottom",
    offset = 8,
    contentClassName,
}: PopoverProps) {
    const wrapperRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);

    const close = useCallback(() => onOpenChange(false), [onOpenChange]);

    useEffect(() => {
        if (!open) return;
        const handle = (e: MouseEvent) => {
            const w = wrapperRef.current;
            const c = contentRef.current;
            const target = e.target as Node;
            if (w?.contains(target) || c?.contains(target)) return;
            close();
        };
        document.addEventListener("mousedown", handle);
        return () => document.removeEventListener("mousedown", handle);
    }, [open, close]);

    const contentStyle: CSSProperties = contentClassName
        ? {
              ...contentBaseStyle,
              ...(open ? contentVisibleStyle : {}),
          }
        : {
              ...getContentPlacementStyle(placement, offset),
              ...contentAppearanceStyle,
              ...(open
                  ? {
                        ...contentVisibleStyle,
                        transform: getContentVisibleTransform(placement),
                    }
                  : {}),
          };

    return (
        <div ref={wrapperRef} style={wrapperStyle}>
            {trigger}
            <div
                ref={contentRef}
                role="dialog"
                className={contentClassName}
                style={contentStyle}
                aria-hidden={!open}
                {...(contentClassName ? { "data-open": open } : {})}
            >
                {children}
            </div>
        </div>
    );
}
