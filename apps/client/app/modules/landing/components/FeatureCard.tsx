"use client";

import { Card, CardContent, CardHeader, cn, Typography } from "@packages/react-ui";
import { motion, useMotionTemplate, useMotionValue, useSpring } from "motion/react";
import Image from "next/image";

export function FeatureCard({
	id,
	title,
	description,
	image,
	className,
	onClick,
}: {
	id: string;
	title: string;
	description: string;
	image?: string;
	className?: string;
	onClick?: () => void;
}) {
	const mX = useMotionValue(0);
	const mY = useMotionValue(0);

	const mouseX = useSpring(mX, { stiffness: 100, damping: 20 });
	const mouseY = useSpring(mY, { stiffness: 100, damping: 20 });

	function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
		const { left, top } = currentTarget.getBoundingClientRect();
		mX.set(clientX - left);
		mY.set(clientY - top);
	}

	return (
		<motion.div
			layoutId={`feature-${id}`}
			className={cn("group relative w-full h-full min-h-full flex cusror-none", className)}
			onMouseMove={handleMouseMove}
			onClick={onClick}
			transition={{ type: "spring", damping: 25, stiffness: 300 }}
		>
			<div className="absolute -inset-1 rounded-4xl bg-amber-500/5 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
			<div className="absolute -inset-px rounded-[21px] bg-white/10 transition-colors duration-500 group-hover:bg-linear-to-b group-hover:from-amber-500/40 group-hover:via-amber-500/10 group-hover:to-amber-500/40" />

			<Card className="relative w-full h-full overflow-hidden rounded-[21px] border-none bg-[#010309]/95 backdrop-blur-3xl p-8 md:p-10 flex flex-col items-start justify-between flex-1">
				<motion.div
					className="pointer-events-none absolute -inset-px opacity-0 transition duration-500 group-hover:opacity-100"
					style={{
						background: useMotionTemplate`
              radial-gradient(
                500px circle at ${mouseX}px ${mouseY}px,
                rgba(251, 191, 36, 0.05),
                transparent 80%
              )
            `,
					}}
				/>

				{image && (
					<div className="top-0 right-0 w-1/3 h-full opacity-20 group-hover:opacity-30 transition-opacity rounded-r-[21px] overflow-hidden relative">
						<Image src={image} alt="" fill className="object-cover" sizes="50ww" />
					</div>
				)}

				<div className="relative z-10 w-full">
					<CardHeader className="p-0">
						<Typography.H3 className="text-3xl md:text-4xl font-black tracking-tighter text-white leading-tight">
							{title}
						</Typography.H3>
					</CardHeader>

					<CardContent className="p-0 mt-6">
						<Typography.Paragraph className="text-slate-400 text-lg md:text-xl font-light leading-relaxed">
							{description}
						</Typography.Paragraph>
					</CardContent>
				</div>

				<div className="relative z-10 mt-auto pt-8 flex w-full justify-end">
					<div className="flex flex-col items-end gap-1 opacity-20 group-hover:opacity-50 transition-opacity">
						<div className="h-px w-12 bg-amber-500" />
						<div className="h-px w-6 bg-amber-500" />
					</div>
				</div>
			</Card>
		</motion.div>
	);
}
