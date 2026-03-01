"use client";

import { Typography } from "@packages/react-ui";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";

export type FeatureItem = {
	id: string;
	title: string;
	description: string;
	image?: string;
	fullDescription?: string;
};

type Props = {
	feature: FeatureItem | null;
	onClose: () => void;
};

export function FeatureDetailOverlay({ feature, onClose }: Props) {
	return (
		<AnimatePresence>
			{feature && (
				<motion.div
					key={feature.id}
					className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					transition={{ duration: 0.2 }}
					onClick={onClose}
					aria-modal
					role="dialog"
					aria-label={feature.title}
				>
					<motion.div
						className="absolute inset-0 flex items-center justify-center p-4 pointer-events-none"
						layoutRoot
						style={{ pointerEvents: "none" }}
					>
						<motion.div
							layoutId={`feature-${feature.id}`}
							className="pointer-events-auto w-full max-w-2xl max-h-[85vh] overflow-hidden rounded-[21px] border border-white/10 bg-[#010309]/98 backdrop-blur-xl shadow-2xl flex flex-col"
							onClick={(e) => e.stopPropagation()}
							transition={{ type: "spring", damping: 25, stiffness: 300 }}
						>
							{feature.image && (
								<div className="relative w-full aspect-video bg-[#0f172a] overflow-hidden shrink-0">
									<Image
										src={feature.image}
										alt=""
										fill
										className="object-cover"
										sizes="(max-width: 768px) 100vw, 672px"
									/>
								</div>
							)}
							<div className="p-8 md:p-10 flex flex-col gap-4 overflow-auto">
								<Typography.H2 className="text-3xl md:text-4xl font-black text-white tracking-tight">
									{feature.title}
								</Typography.H2>
								<Typography.Paragraph className="text-slate-400 text-lg leading-relaxed">
									{feature.fullDescription}
								</Typography.Paragraph>
							</div>
						</motion.div>
					</motion.div>
				</motion.div>
			)}
		</AnimatePresence>
	);
}
