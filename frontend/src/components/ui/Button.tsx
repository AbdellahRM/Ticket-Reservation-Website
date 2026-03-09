import { type ButtonHTMLAttributes, forwardRef } from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';
import { cn } from '../../utils/cn';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends Omit<HTMLMotionProps<"button">, "ref"> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
    size?: 'sm' | 'md' | 'lg' | 'icon';
    isLoading?: boolean;
}

const buttonVariants = {
    primary: 'bg-primary text-white hover:bg-primary-dark shadow-[0_4px_20px_rgba(108,99,255,0.3)] hover:shadow-[0_8px_32px_rgba(108,99,255,0.45)]',
    secondary: 'bg-white/10 text-white backdrop-blur-md hover:bg-white/20 border border-white/20',
    outline: 'border-2 border-primary text-primary hover:bg-primary hover:text-white',
    ghost: 'bg-transparent text-text-muted hover:text-white hover:bg-white/10',
    danger: 'bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white border border-red-500/20',
};

const buttonSizes = {
    sm: 'h-9 px-4 text-sm',
    md: 'h-11 px-6 text-base',
    lg: 'h-14 px-8 text-lg',
    icon: 'h-11 w-11 flex items-center justify-center p-0',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = 'primary', size = 'md', isLoading, children, disabled, ...props }, ref) => {
        return (
            <motion.button
                ref={ref}
                whileHover={{ scale: disabled || isLoading ? 1 : 1.02, y: disabled || isLoading ? 0 : -2 }}
                whileTap={{ scale: disabled || isLoading ? 1 : 0.98 }}
                className={cn(
                    'inline-flex items-center justify-center rounded-xl font-semibold transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed',
                    buttonVariants[variant],
                    buttonSizes[size],
                    className
                )}
                disabled={Boolean(disabled || isLoading)}
                {...props}
            >
                {isLoading ? (
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                ) : null}
                {children}
            </motion.button>
        );
    }
);

Button.displayName = 'Button';
