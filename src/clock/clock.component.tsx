import { useEffect, useState } from "react";
import "./clock.component.css";

const rings = [
	{ unit: "hours", count: 12 },
	{ unit: "minutes", count: 60 },
	{ unit: "seconds", count: 60 },
] as const;

export const ClockComponent = () => {
	const [now, setNow] = useState(() => new Date());

	useEffect(() => {
		const timer = window.setInterval(() => setNow(new Date()), 1000);
		return () => window.clearInterval(timer);
	}, []);

	const current = {
		hours: now.getHours() % 12,
		minutes: now.getMinutes(),
		seconds: now.getSeconds(),
	};
	const time = [now.getHours(), current.minutes, current.seconds]
		.map((value) => String(value).padStart(2, "0"))
		.join(":");

	return (
		<section className="clock-widget" aria-label="Reloj">
			<div
				className="clock-widget__face"
				role="timer"
				aria-label={time}
				aria-live="off"
			>
				{rings.map(({ unit, count }) => (
					<div
						key={unit}
						className={`clock-widget__ring clock-widget__ring--${unit}`}
						aria-hidden="true"
					>
						{Array.from({ length: count }, (_, index) => (
							<span
								key={index}
								className={`clock-widget__dot${
									current[unit] === index ? " clock-widget__dot--active" : ""
								}`}
								style={{
									transform: `rotate(${
										(360 / count) * index
									}deg) translateY(calc((var(--clock-radius) + var(--dot-h) * 0.5) * -1))`,
								}}
							/>
						))}
					</div>
				))}
				<time className="clock-widget__time" dateTime={time} aria-hidden="true">
					{time}
				</time>
			</div>
		</section>
	);
};
