import * as React from "react";
import { cn } from "../../lib/utils";

export interface TypographyProps extends React.HTMLAttributes<HTMLElement> {}

const H1 = React.forwardRef<HTMLHeadingElement, TypographyProps>(({ className, ...props }, ref) => (
	<h1
		ref={ref}
		className={cn("scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl", className)}
		{...props}
	/>
));
H1.displayName = "Typography.H1";

const H2 = React.forwardRef<HTMLHeadingElement, TypographyProps>(({ className, ...props }, ref) => (
	<h2
		ref={ref}
		className={cn(
			"scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0",
			className,
		)}
		{...props}
	/>
));
H2.displayName = "Typography.H2";

const Paragraph = React.forwardRef<HTMLParagraphElement, TypographyProps>(
	({ className, ...props }, ref) => (
		<p ref={ref} className={cn("leading-7 not(:first-child)]:mt-6", className)} {...props} />
	),
);
Paragraph.displayName = "Typography.Paragraph";

const Muted = React.forwardRef<HTMLParagraphElement, TypographyProps>(
	({ className, ...props }, ref) => (
		<p ref={ref} className={cn("text-muted-foreground text-sm", className)} {...props} />
	),
);
Muted.displayName = "Typography.Muted";

export function TypographyH3() {
	return <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">The Joke Tax</h3>;
}

const H3 = React.forwardRef<HTMLHeadingElement, TypographyProps>(({ className, ...props }, ref) => (
	<h3
		ref={ref}
		className={cn("scroll-m-20 text-xl font-semibold tracking-tight", className)}
		{...props}
	/>
));
H3.displayName = "Typography.H3";

export const Typography = {
	H1,
	H2,
	H3,
	Paragraph,
	Muted,
};
