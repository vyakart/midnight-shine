import React from "react";
import { motion } from "framer-motion";
import { cn } from "../lib/cn";
import { TileRenderer } from "./tiles/TileRenderer";
import type { TileData } from "./tiles/types";

/**
 * Enhanced BentoGrid with me-bento integration
 * ------------------------------------------------------------
 * • CSS Grid layout with responsive behavior
 * • Integration with specialized tile components
 * • Enhanced animations and micro-interactions
 * • CSS variable-based theming system
 */

interface BentoGridEnhancedProps {
  tiles: TileData[];
  columns?: { base: number; md: number; lg: number };
  rowHeight?: { base: number; md: number; lg: number };
  gap?: number;
  className?: string;
  enableAnimations?: boolean;
  staggerDelay?: number;
}

export const BentoGridEnhanced: React.FC<BentoGridEnhancedProps> = ({
  tiles,
  columns = { base: 1, md: 2, lg: 3 },
  rowHeight = { base: 120, md: 140, lg: 150 },
  gap = 4,
  className,
  enableAnimations = true,
  staggerDelay = 0.1,
}) => {
  const gridClass = cn(
    "grid",
    `auto-rows-[${rowHeight.base}px]`,
    `grid-cols-${columns.base}`,
    `gap-${gap}`,
    `md:auto-rows-[${rowHeight.md}px] md:grid-cols-${columns.md}`,
    `lg:auto-rows-[${rowHeight.lg}px] lg:grid-cols-${columns.lg}`,
    className
  );

  return (
    <div className={gridClass}>
      {tiles.map((tile, index) => (
        <TileWrapper
          key={tile.id}
          tile={tile}
          index={index}
          enableAnimations={enableAnimations}
          staggerDelay={staggerDelay}
        />
      ))}
    </div>
  );
};

// Enhanced Tile Wrapper with animations and grid positioning
interface TileWrapperProps {
  tile: TileData;
  index: number;
  enableAnimations: boolean;
  staggerDelay: number;
}

const TileWrapper: React.FC<TileWrapperProps> = ({
  tile,
  index,
  enableAnimations,
  staggerDelay,
}) => {
  const colSpan = tile.colSpan || 1;
  const rowSpan = tile.rowSpan || 1;

  // Map numeric values to Tailwind classes
  const colClass = `col-span-${colSpan}`;
  const rowClass = `row-span-${rowSpan}`;

  const animationVariants = {
    hidden: {
      opacity: 0,
      y: 20,
      scale: 0.95,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
    },
  };

  const transitionConfig = {
    duration: 0.5,
    delay: enableAnimations ? index * staggerDelay : 0,
    ease: [0.25, 0.46, 0.45, 0.94] as const,
  };

  return (
    <motion.div
      className={cn(
        "relative overflow-hidden rounded-lg",
        "bg-card border border-border",
        "transition-all duration-200",
        "hover:shadow-lg hover:border-ring/50",
        colClass,
        rowClass
      )}
      variants={animationVariants}
      initial={enableAnimations ? "hidden" : "visible"}
      animate="visible"
      transition={transitionConfig}
      whileHover={
        enableAnimations
          ? {
              y: -4,
              scale: 1.02,
              transition: { type: "spring", stiffness: 400, damping: 25 },
            }
          : undefined
      }
      whileTap={
        enableAnimations
          ? {
              scale: 0.98,
              transition: { duration: 0.1 },
            }
          : undefined
      }
    >
      <TileRenderer tileData={tile} />

      {/* Subtle glow effect on hover */}
      <motion.div
        className="absolute inset-0 rounded-lg bg-gradient-to-br from-primary/5 to-transparent opacity-0 pointer-events-none"
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      />

      {/* Animated border accent */}
      <motion.div
        className="absolute inset-0 rounded-lg border border-primary/20 opacity-0 pointer-events-none"
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
      />
    </motion.div>
  );
};

export default BentoGridEnhanced;