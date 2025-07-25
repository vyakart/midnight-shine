import React from "react";
import { motion } from "framer-motion";

/**
 * BentoGrid v2 – "Bento.me"‑style personal dashboard layout
 * ------------------------------------------------------------
 * • 3‑column grid on desktop (configurable) with fixed row heights so every
 *   cell lines up neatly (no Masonry hacks needed).
 * • Items choose their footprint via `colSpan` & `rowSpan`, just like classic
 *   CSS Grid. (Profile → 1×3, small link → 1×1, large map → 2×2, …)
 * • DefaultCard handles the common "icon + title (+ subtitle)" pattern used by
 *   Bento.me link tiles, but you can also supply a fully‑custom `element`.
 *
 * Props ----------------------------------------------------------------------
 *  items: Array<{
 *    id:        string | number;
 *    // Layout
 *    colSpan?:  1 | 2 | 3;   // how many columns to span (desktop)
 *    rowSpan?:  1 | 2 | 3;   // how many rows   to span (desktop)
 *    // Presentation
 *    title?:    string;
 *    subtitle?: string;
 *    icon?:     React.ReactNode; // small SVG / emoji / component
 *    image?:    string;          // square/rect img URL
 *    href?:     string;          // optional <a> wrapper
 *    element?:  React.ReactNode; // completely custom card body (overrides
 *                                // DefaultCard)
 *    className?:string;          // extra utility classes
 *    onClick?:  () => void;      // click handler
 *  }>
 *  columns?: { base:number, md:number, lg:number }
 *  rowHeight?: { base:number, md:number, lg:number }
 *  gap?:        number;           // Tailwind spacing unit (default 4 ⇒ 1rem)
 */

interface BentoItem {
  id: string | number;
  // Layout
  colSpan?: 1 | 2 | 3;
  rowSpan?: 1 | 2 | 3;
  // Presentation
  title?: string;
  subtitle?: string;
  icon?: React.ReactNode;
  image?: string;
  href?: string;
  element?: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

interface BentoGridProps {
  items: BentoItem[];
  columns?: { base: number; md: number; lg: number };
  rowHeight?: { base: number; md: number; lg: number };
  gap?: number;
}

function BentoGridV2({
  items,
  columns = { base: 1, md: 2, lg: 3 },
  rowHeight = { base: 120, md: 140, lg: 150 },
  gap = 4,
}: BentoGridProps) {
  // Tailwind needs *static* class names to be purge‑safe. Embed all possible
  // span combos in a comment so they survive `@apply`‑time treeshaking ↓↓↓
  /*
    col-span-1 col-span-2 col-span-3 col-span-4
    row-span-1 row-span-2 row-span-3 row-span-4
  */

  const gridClass = [
    "grid",
    `auto-rows-[${rowHeight.base}px]`,
    `grid-cols-${columns.base}`,
    `gap-${gap}`,
    `md:auto-rows-[${rowHeight.md}px] md:grid-cols-${columns.md}`,
    `lg:auto-rows-[${rowHeight.lg}px] lg:grid-cols-${columns.lg}`,
  ].join(" ");

  return (
    <div className={gridClass}>
      {items.map((item) => (
        <Tile key={item.id} {...item} />
      ))}
    </div>
  );
}

// -----------------------------------------------------------------------------
// Tile wrapper – adds hover motion + col/row spans
// -----------------------------------------------------------------------------
function Tile({ colSpan = 1, rowSpan = 1, element, className = "", onClick, ...rest }: BentoItem) {
  // Map numeric → Tailwind utility (purge safe because of static comment above)
  const colClass = `col-span-${colSpan}`;
  const rowClass = `row-span-${rowSpan}`;

  const TileComponent = onClick ? motion.button : motion.div;

  return (
    <TileComponent
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 260, damping: 22, mass: 0.7 }}
      className={[
        "relative overflow-hidden rounded-2xl",
        "border border-neutral-200 bg-white/60 backdrop-blur-sm",
        "dark:border-neutral-700 dark:bg-slate-800/60",
        colClass,
        rowClass,
        onClick ? "cursor-pointer" : "",
        className,
      ].join(" ")}
      onClick={onClick}
    >
      {element ? element : <DefaultCard {...rest} />}
    </TileComponent>
  );
}

// -----------------------------------------------------------------------------
// DefaultCard – icon/img   +   title ( + subtitle )   link tile
// -----------------------------------------------------------------------------
function DefaultCard({ title, subtitle, href, icon, image }: Omit<BentoItem, 'id' | 'colSpan' | 'rowSpan' | 'element' | 'className' | 'onClick'>) {
  const body = (
    <div className="flex w-full items-center space-x-3 px-4 py-3 md:space-x-4">
      {/* Media */}
      {image ? (
        <img
          src={image}
          alt={title}
          className="h-12 w-12 rounded-xl object-cover md:h-14 md:w-14"
        />
      ) : (
        icon && <span className="text-xl md:text-2xl">{icon}</span>
      )}

      {/* Text */}
      <div className="flex flex-col truncate">
        {title && (
          <span className="truncate text-sm font-medium md:text-base dark:text-white">
            {title}
          </span>
        )}
        {subtitle && (
          <span className="truncate text-xs text-neutral-500 md:text-sm dark:text-neutral-400">
            {subtitle}
          </span>
        )}
      </div>
    </div>
  );

  return href ? (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="block h-full w-full transition-colors hover:bg-neutral-100/40 dark:hover:bg-slate-700/40"
    >
      {body}
    </a>
  ) : (
    body
  );
}

// -----------------------------------------------------------------------------
// Legacy exports for backward compatibility
// -----------------------------------------------------------------------------
export const BentoCard: React.FC<{
  size: 'small' | 'medium' | 'large'
  children: React.ReactNode
  onClick?: () => void
  className?: string
  title?: string
}> = ({ size, children, onClick, className = "", title }) => {
  const sizeClasses = {
    small: 'col-span-1 md:col-span-1 lg:col-span-2 xl:col-span-2 row-span-1',
    medium: 'col-span-2 md:col-span-2 lg:col-span-3 xl:col-span-4 row-span-1',
    large: 'col-span-2 md:col-span-2 lg:col-span-3 xl:col-span-4 row-span-2'
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.1 }}
      whileHover={{
        scale: 1.02,
        y: -8,
        transition: { duration: 0.3, ease: "easeOut" }
      }}
      onClick={onClick}
      className={`
        ${sizeClasses[size]}
        bg-white dark:bg-slate-800
        rounded-2xl
        border border-slate-200 dark:border-slate-700
        p-6
        cursor-pointer
        transition-all duration-300 ease-out
        hover:border-blue-300 dark:hover:border-purple-400
        hover:shadow-2xl hover:shadow-blue-500/10
        dark:hover:shadow-purple-500/10
        relative
        overflow-hidden
        group
        backdrop-blur-sm
        ${className}
      `}
      style={{
        background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
      }}
    >
      {/* Glow effect overlay */}
      <motion.div
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, rgba(147, 51, 234, 0.05) 100%)',
          filter: 'blur(20px)',
        }}
        initial={false}
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0, 0.3, 0],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      {/* Subtle gradient border on hover */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-400/20 via-transparent to-purple-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      {title && (
        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-4">
          {title}
        </h3>
      )}
      {children}
    </motion.div>
  )
}

// Original BentoGrid component for backward compatibility
export const BentoGrid: React.FC<{
  children: React.ReactNode
  className?: string
}> = ({ children, className = "" }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className={`
        grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8
        auto-rows-[200px]
        gap-3 md:gap-4 lg:gap-6
        p-4 md:p-6 lg:p-8
        max-w-[1400px] mx-auto
        ${className}
      `}
    >
      {children}
    </motion.div>
  )
}

// Export the new BentoGrid as default and named export
export default BentoGridV2;
export { BentoGridV2 as NewBentoGrid };