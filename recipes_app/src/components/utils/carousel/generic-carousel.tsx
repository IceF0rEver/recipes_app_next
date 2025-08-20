"use client";

import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
} from "@/components/ui/carousel";

type Orientation = "horizontal" | "vertical";

interface GenericCarouselProps<T> {
	itemComponent: (item: T) => React.ReactNode;
	data: T[];
	orientation?: Orientation;
	className?: string;
	title?: string;
	options?: Record<string, unknown>;
}

export default function GenericCarousel<T>({
	data,
	itemComponent,
	orientation = "horizontal",
	className,
	title,
	options,
}: GenericCarouselProps<T>) {
	return data.length > 0 ? (
		<div>
			{title && (
				<h2 className="text-2xl font-semibold text-foreground py-2">{title}</h2>
			)}
			<div className={className}>
				<Carousel opts={options} orientation={orientation} className="grid">
					<CarouselContent>
						{data.map((item, index) => (
							// biome-ignore lint/suspicious/noArrayIndexKey: index for key
							<CarouselItem key={index} className="p-2 md:p-4 basis-auto">
								{itemComponent(item)}
							</CarouselItem>
						))}
					</CarouselContent>
					<CarouselNext className="hidden md:flex" />
					<CarouselPrevious className="hidden md:flex" />
				</Carousel>
			</div>
		</div>
	) : null;
}
