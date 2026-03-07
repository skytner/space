"use client";

import { Typography } from "@packages/react-ui";
import { X } from "lucide-react";
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
	enableLayoutAnimation?: boolean;
};

export function FeatureDetailOverlay({ feature, onClose, enableLayoutAnimation = true }: Props) {
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
					{enableLayoutAnimation ? (
						<motion.div
							className="absolute inset-0 flex items-center justify-center p-4 pointer-events-none"
							layoutRoot
							style={{ pointerEvents: "none" }}
						>
							<motion.div
								layoutId={`feature-${feature.id}`}
								className="pointer-events-auto relative w-full max-w-2xl max-h-[85vh] overflow-hidden rounded-[21px] border border-white/10 bg-[#010309]/98 backdrop-blur-sm shadow-2xl flex flex-col"
								onClick={(e) => e.stopPropagation()}
								transition={{ type: "spring", damping: 30, stiffness: 350 }}
							>
								<button
									type="button"
									onClick={onClose}
									className="absolute top-4 right-4 z-10 p-1.5 rounded-full mix-blend-difference"
									aria-label="Close"
								>
									<X className="w-6 h-6 text-white" />
								</button>

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
									<Typography.H2 className="text-3xl md:text-4xl font-black text-white tracking-tight pr-8">
										{feature.title}
									</Typography.H2>
									<Typography.Paragraph className="text-slate-400 text-lg leading-relaxed">
										{feature.fullDescription}
									</Typography.Paragraph>
								</div>
							</motion.div>
						</motion.div>
					) : (
						<motion.div
							className="relative w-full max-w-2xl max-h-[85vh] overflow-hidden rounded-[21px] border border-white/10 bg-[#010309] shadow-2xl flex flex-col"
							onClick={(e) => e.stopPropagation()}
							initial={{ opacity: 0, scale: 0.95, y: 16 }}
							animate={{ opacity: 1, scale: 1, y: 0 }}
							exit={{ opacity: 0, scale: 0.95, y: 16 }}
							transition={{ type: "tween", duration: 0.18, ease: "easeOut" }}
						>
							<button
								type="button"
								onClick={onClose}
								className="absolute top-4 right-4 z-10 p-1.5 rounded-full mix-blend-difference"
								aria-label="Close"
							>
								<X className="w-4 h-4 text-white" />
							</button>

							{feature.image && (
								<div className="relative w-full aspect-video bg-[#0f172a] overflow-hidden shrink-0">
									<Image src={feature.image} alt="" fill className="object-cover" sizes="100vw" />
								</div>
							)}
							<div className="p-6 md:p-10 flex flex-col gap-4 overflow-auto">
								<Typography.H2 className="text-3xl font-black text-white tracking-tight pr-8">
									{feature.title}
								</Typography.H2>
								<Typography.Paragraph className="text-slate-400 text-base leading-relaxed">
									{feature.fullDescription}
								</Typography.Paragraph>
							</div>
						</motion.div>
					)}
				</motion.div>
			)}
		</AnimatePresence>
	);
}
