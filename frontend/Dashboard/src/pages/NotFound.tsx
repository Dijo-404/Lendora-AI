/**
 * Lendora AI - 404 Not Found Page
 */

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { AuroraBackground } from '@/components/ui/AuroraBackground';
import { useNavigate } from 'react-router-dom';
import { Home, ArrowLeft, Sparkles } from 'lucide-react';

export default function NotFound() {
    const navigate = useNavigate();

    return (
        <AuroraBackground>
            <div className="min-h-screen flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center max-w-md"
                >
                    {/* Animated Icon */}
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                        className="w-24 h-24 mx-auto mb-8 rounded-full bg-primary/10 flex items-center justify-center"
                    >
                        <Sparkles className="w-12 h-12 text-primary" />
                    </motion.div>

                    {/* Title */}
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4, duration: 0.6 }}
                        className="text-6xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"
                    >
                        404
                    </motion.h1>

                    {/* Subtitle */}
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5, duration: 0.6 }}
                        className="text-2xl font-semibold mb-4"
                    >
                        Page Not Found
                    </motion.h2>

                    {/* Description */}
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6, duration: 0.6 }}
                        className="text-muted-foreground mb-8"
                    >
                        The page you're looking for doesn't exist or has been moved.
                        Let's get you back to the Lendora AI dashboard.
                    </motion.p>

                    {/* Action Buttons */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7, duration: 0.6 }}
                        className="flex flex-col sm:flex-row gap-4 justify-center"
                    >
                        <Button
                            onClick={() => navigate('/dashboard')}
                            size="lg"
                            className="bg-primary hover:bg-primary/90"
                        >
                            <Home className="w-4 h-4 mr-2" />
                            Go to Dashboard
                        </Button>

                        <Button
                            onClick={() => navigate(-1)}
                            variant="outline"
                            size="lg"
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Go Back
                        </Button>
                    </motion.div>

                    {/* Additional Info */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.8, duration: 0.6 }}
                        className="mt-12 p-4 rounded-lg bg-muted/30 border border-border"
                    >
                        <p className="text-sm text-muted-foreground">
                            If you believe this is an error, please contact support or try refreshing the page.
                        </p>
                    </motion.div>
                </motion.div>
            </div>
        </AuroraBackground>
    );
}
