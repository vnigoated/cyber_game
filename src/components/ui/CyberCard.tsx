import React from 'react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

interface CyberCardProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
    variant?: 'default' | 'alert' | 'success';
    cornerSize?: 'sm' | 'md' | 'lg';
}

/**
 * CyberCard
 * A container with "cut-out" corners and holographic border effects.
 * Uses custom CSS clip-path defined in globals.css or inline.
 */
const CyberCard = React.forwardRef<HTMLDivElement, CyberCardProps>(
    ({ className, children, variant = 'default', cornerSize = 'md', ...props }, ref) => {

        // Determine border color based on variant
        const borderColor = {
            default: 'border-primary',
            alert: 'border-destructive',
            success: 'border-green-500' // Using tailwind color directly or CSS var
        }[variant];

        const glowColor = {
            default: 'shadow-primary/20',
            alert: 'shadow-destructive/20',
            success: 'shadow-green-500/20'
        }[variant];

        return (
            <div
                ref={ref}
                className={cn(
                    "relative group",
                    className
                )}
                {...props}
            >
                {/* Main Background with Clip Path */}
                <div
                    className={cn(
                        "relative z-10 bg-card/90 backdrop-blur-md border border-transparent",
                        "cyber-clip-path", // Custom class for clip-path
                        "before:absolute before:inset-0 before:z-[-1] before:bg-gradient-to-br before:from-white/5 before:to-transparent", // Subtle sheen
                    )}
                >
                    {/* Border Lines (SVG or CSS Overlay for borders involving clip path is tricky, 
                so we might use a pseudo element or DropShadow filter on the parent) 
            */}

                    {/* Tech Accents - Corners */}
                    <div className={cn("absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2", borderColor)} />
                    <div className={cn("absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2", borderColor)} />
                    <div className={cn("absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2", borderColor)} />
                    <div className={cn("absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2", borderColor)} />

                    {/* Decorative Scanline or Grid Texture inside */}
                    <div className="absolute inset-0 z-[-1] opacity-5 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_1px] pointer-events-none" />

                    {children}
                </div>

                {/* Outer Glow / Drop Shadow via parent div filter */}
                <div className={cn("absolute inset-0 -z-10 blur-sm opacity-50 bg-primary/20 cyber-clip-path translate-y-1 scale-[1.01]")} />
            </div>
        );
    }
);

CyberCard.displayName = 'CyberCard';

export { CyberCard, CardHeader, CardContent, CardFooter, CardTitle };
