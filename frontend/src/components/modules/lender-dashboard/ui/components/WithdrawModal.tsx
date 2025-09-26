"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LenderInvestment } from "../../types/lender-dashboard.types";
import { AlertTriangleIcon } from "lucide-react";
import Image from "next/image";

interface WithdrawModalProps {
  isOpen: boolean;
  onClose: () => void;
  investment?: LenderInvestment;
}

const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

export function WithdrawModal({ isOpen, onClose, investment }: WithdrawModalProps) {
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

  const handleWithdraw = async () => {
    if (!investment || !amount) return;
    
    setLoading(true);
    try {
      // Simulate withdrawal process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // TODO: Implement actual withdrawal logic
      console.log(`Withdrawing ${amount} from ${investment.asset.symbol}`);
      
      onClose();
      setAmount("");
    } catch (error) {
      console.error("Withdrawal failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleMaxWithdraw = () => {
    if (investment) {
      setAmount(investment.value.toString());
    }
  };

  if (!investment) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">Withdraw Investment</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Investment Summary */}
          <Card className="bg-neutral-800 border-neutral-700">
            <CardContent className="p-4">
              <div className="flex items-center gap-3 mb-3">
                <Image
                  src={investment.asset.icon}
                  alt={investment.asset.name}
                  width={32}
                  height={32}
                  className="rounded-full"
                />
                <div>
                  <h3 className="font-semibold text-white">{investment.asset.symbol}</h3>
                  <p className="text-sm text-gray-400">{investment.poolName}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-400">Current Value</p>
                  <p className="font-semibold text-white">{formatCurrency(investment.value)}</p>
                </div>
                <div>
                  <p className="text-gray-400">Earned Interest</p>
                  <p className="font-semibold text-[#35bb64]">+{formatCurrency(investment.earnedInterest)}</p>
                </div>
                <div>
                  <p className="text-gray-400">APY</p>
                  <p className="font-semibold text-white">{investment.apy}%</p>
                </div>
                <div>
                  <p className="text-gray-400">Status</p>
                  <Badge variant="outline" className="text-[#35bb64] border-[#35bb64] text-xs">
                    {investment.status}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Withdrawal Amount */}
          <div className="space-y-3">
            <Label htmlFor="amount" className="text-sm font-medium">
              Withdrawal Amount
            </Label>
            <div className="relative">
              <Input
                id="amount"
                type="number"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="pr-20"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={handleMaxWithdraw}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 h-7 px-2 text-xs"
              >
                MAX
              </Button>
            </div>
            <p className="text-xs text-gray-400">
              Available: {formatCurrency(investment.value)}
            </p>
          </div>

          {/* Warning */}
          <div 
            className="flex items-start gap-3 p-3 border border-yellow-700 rounded-lg relative z-10 shadow-lg"
            style={{ 
              backgroundColor: '#92400e', 
              backgroundImage: 'none',
              opacity: '1'
            }}
          >
            <AlertTriangleIcon className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
            <div className="text-sm relative z-10">
              <p className="font-medium text-yellow-200 mb-1">Withdrawal Notice</p>
              <p className="text-yellow-100">
                Withdrawing your investment will stop earning interest immediately. 
                Consider the impact on your overall returns.
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1 border-neutral-600 text-gray-300 hover:bg-neutral-600"
            >
              Cancel
            </Button>
            <Button
              onClick={handleWithdraw}
              disabled={!amount || parseFloat(amount) <= 0 || parseFloat(amount) > investment.value || loading}
              className="flex-1 bg-[#35bb64] hover:bg-[#2da354] text-white"
            >
              {loading ? "Processing..." : "Withdraw"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
