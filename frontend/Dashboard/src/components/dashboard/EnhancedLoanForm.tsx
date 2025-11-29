/**
 * Lendora AI - Enhanced Loan Form
 * Rich form interface for loan creation with validation
 */

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { motion } from 'framer-motion';
import {
    Play,
    Loader2,
    User,
    Building2,
    Calculator,
    DollarSign,
    Percent,
    Calendar,
    AlertCircle
} from 'lucide-react';

export interface LoanFormData {
    role: 'borrower' | 'lender';
    walletAddress: string;
    borrower_address?: string;
    lender_address?: string;
    credit_score: number;
    principal: number;
    interest_rate: number;
    term_months: number;
    stablecoin: string;
    autoConfirm: boolean;
}

interface EnhancedLoanFormProps {
    onSubmit: (data: LoanFormData) => void;
    isSubmitting?: boolean;
}

const STABLECOINS = [
    { value: 'USDT', label: 'Tether (USDT)', icon: '💰' },
    { value: 'USDC', label: 'USD Coin (USDC)', icon: '🪙' },
    { value: 'DAI', label: 'Dai (DAI)', icon: '🏛️' },
    { value: 'ADA', label: 'Cardano (ADA)', icon: '₳' }
];

export function EnhancedLoanForm({ onSubmit, isSubmitting = false }: EnhancedLoanFormProps) {
    const [formData, setFormData] = useState<LoanFormData>({
        role: 'borrower',
        walletAddress: '',
        credit_score: 750,
        principal: 1000,
        interest_rate: 8.5,
        term_months: 12,
        stablecoin: 'USDT',
        autoConfirm: false
    });

    const [errors, setErrors] = useState<Partial<Record<keyof LoanFormData, string>>>({});

    const validateForm = (): boolean => {
        const newErrors: Partial<Record<keyof LoanFormData, string>> = {};

        if (formData.principal <= 0) {
            newErrors.principal = 'Principal must be greater than 0';
        }

        if (formData.interest_rate <= 0 || formData.interest_rate > 100) {
            newErrors.interest_rate = 'Interest rate must be between 0 and 100';
        }

        if (formData.term_months < 1 || formData.term_months > 120) {
            newErrors.term_months = 'Term must be between 1 and 120 months';
        }

        if (formData.credit_score < 300 || formData.credit_score > 850) {
            newErrors.credit_score = 'Credit score must be between 300 and 850';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validateForm()) {
            onSubmit(formData);
        }
    };

    const updateFormData = (field: keyof LoanFormData, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        // Clear error when user starts typing
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: undefined }));
        }
    };

    const calculateMonthlyPayment = () => {
        const principal = formData.principal;
        const monthlyRate = formData.interest_rate / 100 / 12;
        const numberOfPayments = formData.term_months;

        if (monthlyRate === 0) return principal / numberOfPayments;

        return principal * (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) /
               (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
    };

    const monthlyPayment = calculateMonthlyPayment();
    const totalPayment = monthlyPayment * formData.term_months;
    const totalInterest = totalPayment - formData.principal;

    return (
        <Card className="glass-card p-6">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-primary/10">
                    <Calculator className="w-6 h-6 text-primary" />
                </div>
                <div>
                    <h3 className="text-xl font-bold">Loan Configuration</h3>
                    <p className="text-sm text-muted-foreground">Set up your loan parameters</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Role Selection */}
                <div className="space-y-3">
                    <Label className="text-sm font-medium">Role</Label>
                    <div className="grid grid-cols-2 gap-3">
                        {[
                            { value: 'borrower', label: 'Borrower', icon: User, desc: 'Request a loan' },
                            { value: 'lender', label: 'Lender', icon: Building2, desc: 'Provide liquidity' }
                        ].map((role) => (
                            <motion.div
                                key={role.value}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <Button
                                    type="button"
                                    variant={formData.role === role.value ? 'default' : 'outline'}
                                    className={`w-full h-auto p-4 flex flex-col items-center gap-2 ${
                                        formData.role === role.value ? 'bg-primary text-primary-foreground' : ''
                                    }`}
                                    onClick={() => updateFormData('role', role.value)}
                                >
                                    <role.icon className="w-6 h-6" />
                                    <div className="text-center">
                                        <div className="font-medium">{role.label}</div>
                                        <div className="text-xs opacity-75">{role.desc}</div>
                                    </div>
                                </Button>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Principal Amount */}
                <div className="space-y-2">
                    <Label className="text-sm font-medium flex items-center gap-2">
                        <DollarSign className="w-4 h-4" />
                        Principal Amount
                    </Label>
                    <div className="relative">
                        <Input
                            type="number"
                            placeholder="1000"
                            value={formData.principal || ''}
                            onChange={(e) => updateFormData('principal', Number(e.target.value))}
                            className={`pr-16 ${errors.principal ? 'border-red-500' : ''}`}
                        />
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                            ADA
                        </div>
                    </div>
                    {errors.principal && (
                        <p className="text-xs text-red-500 flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" />
                            {errors.principal}
                        </p>
                    )}
                </div>

                {/* Interest Rate */}
                <div className="space-y-2">
                    <Label className="text-sm font-medium flex items-center gap-2">
                        <Percent className="w-4 h-4" />
                        Interest Rate (%)
                    </Label>
                    <Input
                        type="number"
                        step="0.1"
                        placeholder="8.5"
                        value={formData.interest_rate || ''}
                        onChange={(e) => updateFormData('interest_rate', Number(e.target.value))}
                        className={errors.interest_rate ? 'border-red-500' : ''}
                    />
                    {errors.interest_rate && (
                        <p className="text-xs text-red-500 flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" />
                            {errors.interest_rate}
                        </p>
                    )}
                </div>

                {/* Term */}
                <div className="space-y-2">
                    <Label className="text-sm font-medium flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        Term (Months)
                    </Label>
                    <Input
                        type="number"
                        min="1"
                        max="120"
                        placeholder="12"
                        value={formData.term_months || ''}
                        onChange={(e) => updateFormData('term_months', Number(e.target.value))}
                        className={errors.term_months ? 'border-red-500' : ''}
                    />
                    {errors.term_months && (
                        <p className="text-xs text-red-500 flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" />
                            {errors.term_months}
                        </p>
                    )}
                </div>

                {/* Credit Score (for borrowers) */}
                {formData.role === 'borrower' && (
                    <div className="space-y-2">
                    <Label className="text-sm font-medium flex items-center gap-2">
                        <Building2 className="w-4 h-4" />
                        Credit Score
                    </Label>
                        <Input
                            type="number"
                            min="300"
                            max="850"
                            placeholder="750"
                            value={formData.credit_score || ''}
                            onChange={(e) => updateFormData('credit_score', Number(e.target.value))}
                            className={errors.credit_score ? 'border-red-500' : ''}
                        />
                        {errors.credit_score && (
                            <p className="text-xs text-red-500 flex items-center gap-1">
                                <AlertCircle className="w-3 h-3" />
                                {errors.credit_score}
                            </p>
                        )}
                    </div>
                )}

                {/* Stablecoin Selection */}
                <div className="space-y-2">
                    <Label className="text-sm font-medium">Stablecoin</Label>
                    <div className="grid grid-cols-2 gap-2">
                        {STABLECOINS.map((coin) => (
                            <Button
                                key={coin.value}
                                type="button"
                                variant={formData.stablecoin === coin.value ? 'default' : 'outline'}
                                className="justify-start"
                                onClick={() => updateFormData('stablecoin', coin.value)}
                            >
                                <span className="mr-2">{coin.icon}</span>
                                {coin.label}
                            </Button>
                        ))}
                    </div>
                </div>

                {/* Payment Summary */}
                <Card className="glass-card p-4 bg-muted/30">
                    <h4 className="font-medium mb-3 flex items-center gap-2">
                        <Calculator className="w-4 h-4" />
                        Payment Summary
                    </h4>
                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                            <span>Monthly Payment:</span>
                            <span className="font-medium">{monthlyPayment.toFixed(2)} ADA</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Total Interest:</span>
                            <span className="font-medium">{totalInterest.toFixed(2)} ADA</span>
                        </div>
                        <div className="flex justify-between border-t pt-2">
                            <span className="font-medium">Total Payment:</span>
                            <span className="font-bold">{totalPayment.toFixed(2)} ADA</span>
                        </div>
                    </div>
                </Card>

                {/* Submit Button */}
                <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90"
                    size="lg"
                >
                    {isSubmitting ? (
                        <>
                            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                            Processing...
                        </>
                    ) : (
                        <>
                            <Play className="w-5 h-5 mr-2" />
                            Start Loan Workflow
                        </>
                    )}
                </Button>
            </form>
        </Card>
    );
}
