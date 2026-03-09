import { type InputHTMLAttributes, forwardRef, type ReactNode } from 'react';
import { cn } from '../../utils/cn';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    icon?: ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ className, type = 'text', label, error, icon, ...props }, ref) => {
        return (
            <div className="w-full flex flex-col gap-1.5">
                {label && (
                    <label className="text-sm font-medium text-text-muted ml-1">
                        {label}
                    </label>
                )}
                <div className="relative">
                    {icon && (
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted">
                            {icon}
                        </div>
                    )}
                    <input
                        type={type}
                        ref={ref}
                        className={cn(
                            "flex w-full rounded-xl border border-white/10 bg-dark-elevated px-4 py-3 text-sm text-text transition-all duration-300 placeholder:text-text-muted/50 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary disabled:cursor-not-allowed disabled:opacity-50",
                            icon && "pl-11",
                            error && "border-red-500/50 focus:ring-red-500/50 focus:border-red-500",
                            className
                        )}
                        {...props}
                    />
                </div>
                {error && (
                    <p className="text-sm text-red-400 mt-1 ml-1">{error}</p>
                )}
            </div>
        );
    }
);

Input.displayName = 'Input';
