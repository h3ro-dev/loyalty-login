
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { HelpCircle } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { HoldingsFormValues } from "@/hooks/use-holdings-form";

interface HoldingsFieldsProps {
  form: UseFormReturn<HoldingsFormValues>;
}

export function HoldingsFields({ form }: HoldingsFieldsProps) {
  const handleNumberInput = (e: React.ChangeEvent<HTMLInputElement>, onChange: (value: number) => void) => {
    // Remove leading zeros and convert to number
    const value = e.target.value.replace(/^0+/, '') || '0';
    onChange(Number(value));
  };

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <FormField
        control={form.control}
        name="total_nfts"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center gap-2">
              Total NFTs
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <HelpCircle className="h-4 w-4" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Include both staked and unstaked NFTs</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </FormLabel>
            <FormControl>
              <Input
                type="number"
                min="0"
                inputMode="numeric"
                pattern="[0-9]*"
                {...field}
                value={field.value || ''}
                onChange={(e) => handleNumberInput(e, field.onChange)}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="micro_nfts"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Micro NFTs</FormLabel>
            <FormControl>
              <Input
                type="number"
                min="0"
                inputMode="numeric"
                pattern="[0-9]*"
                {...field}
                value={field.value || ''}
                onChange={(e) => handleNumberInput(e, field.onChange)}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="total_tokens"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center gap-2">
              Tokens in Wallet
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <HelpCircle className="h-4 w-4" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Total tokens in your wallet and piggy bank</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </FormLabel>
            <FormControl>
              <Input
                type="number"
                min="0"
                inputMode="numeric"
                pattern="[0-9]*"
                {...field}
                value={field.value || ''}
                onChange={(e) => handleNumberInput(e, field.onChange)}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="piggy_bank_tokens"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Piggy Bank Tokens</FormLabel>
            <FormControl>
              <Input
                type="number"
                min="0"
                inputMode="numeric"
                pattern="[0-9]*"
                {...field}
                value={field.value || ''}
                onChange={(e) => handleNumberInput(e, field.onChange)}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
