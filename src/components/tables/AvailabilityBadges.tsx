import { useLayoutEffect, useRef, useState } from "react";

type AvailabilityBadgesProps = {
  hours?: string[];
};

const BADGE_CLASS =
  "shrink-0 p-1.5 border rounded-full border-gray-500 text-xs text-gray-400";

export function AvailabilityBadges({ hours = [] }: AvailabilityBadgesProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const measureRef = useRef<HTMLDivElement>(null);

  const [visibleCount, setVisibleCount] = useState(hours?.length);

  useLayoutEffect(() => {
    const container = containerRef.current;
    const measure = measureRef.current;

    if (!container || !measure) return;

    const calculate = () => {
      const containerWidth = container.clientWidth;

      const children = Array.from(measure.children) as HTMLElement[];
      if (!children.length) return;

      const plusBadge = children.pop();
      const badges = children;

      const gap = parseFloat(window.getComputedStyle(container).gap) || 0;
      const plusBadgeWidth = plusBadge ? plusBadge.offsetWidth : 0;

      let usedWidth = 0;
      let visible = 0;

      for (let i = 0; i < badges.length; i++) {
        const badgeWidth = badges[i].offsetWidth;

        const currentBadgeCost = visible > 0 ? badgeWidth + gap : badgeWidth;

        const remaining = hours.length - (i + 1);

        const reserveWidth = remaining > 0 ? plusBadgeWidth + gap : 0;

        if (usedWidth + currentBadgeCost + reserveWidth > containerWidth) {
          break;
        }

        usedWidth += currentBadgeCost;
        visible++;
      }

      setVisibleCount(visible);
    };

    calculate();

    const resizeObserver = new ResizeObserver(calculate);
    resizeObserver.observe(container);

    return () => resizeObserver.disconnect();
  }, [hours]);

  const hiddenCount = hours.length - visibleCount;

  return (
    <>
      <div
        ref={measureRef}
        className="absolute top-0 left-0 opacity-0 pointer-events-none flex gap-1 -z-50 h-0 overflow-hidden select-none whitespace-nowrap"
      >
        {hours.map((hour) => (
          <span key={hour} className={BADGE_CLASS}>
            {hour}
          </span>
        ))}
        <span className={BADGE_CLASS}>+{hours.length}</span>
      </div>

      <div
        ref={containerRef}
        className="flex items-center gap-1 overflow-hidden w-full"
      >
        {hours.slice(0, visibleCount).map((hour) => (
          <span key={hour} className={BADGE_CLASS}>
            {hour}
          </span>
        ))}

        {hiddenCount > 0 && <span className={BADGE_CLASS}>+{hiddenCount}</span>}
      </div>
    </>
  );
}
