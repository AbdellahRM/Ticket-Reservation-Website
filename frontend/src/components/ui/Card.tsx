import { type HTMLAttributes, forwardRef } from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';
import { cn } from '../../utils/cn';

export interface CardProps extends HTMLMotionProps<"div"> {
    hoverable?: boolean;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
    ({ className, hoverable, children, ...props }, ref) => {
        return (
            <motion.div
                ref={ref}
                whileHover={hoverable ? { y: -6, transition: { duration: 0.2 } } : {}}
                className={cn(
                    "rounded-2xl border border-white/5 bg-dark-card shadow-lg overflow-hidden",
                    hoverable && "hover:border-primary/30 hover:shadow-[0_16px_48px_rgba(108,99,255,0.15)] transition-colors duration-300",
                    className
                )}
                {...props}
            >
                {children}
            </motion.div>
        );
    }
);
Card.displayName = 'Card';

export const CardHeader = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
    ({ className, children, ...props }, ref) => (
        <div ref={ref} className={cn("p-6 pb-4 border-b border-white/5 bg-dark-elevated/50", className)} {...props}>
            {children}
        </div>
    )
);
CardHeader.displayName = 'CardHeader';

export const CardContent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
    ({ className, children, ...props }, ref) => (
        <div ref={ref} className={cn("p-6", className)} {...props}>
            {children}
        </div>
    )
);
CardContent.displayName = 'CardContent';
