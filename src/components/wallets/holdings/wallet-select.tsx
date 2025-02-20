
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface WalletSelectProps {
  selectedWallet: string | null;
  wallets: Array<{
    id: string;
    address: string;
  }>;
  onWalletSelect: (value: string) => void;
}

export function WalletSelect({ selectedWallet, wallets, onWalletSelect }: WalletSelectProps) {
  return (
    <Select
      value={selectedWallet || ""}
      onValueChange={onWalletSelect}
    >
      <SelectTrigger>
        <SelectValue placeholder="Select a wallet" />
      </SelectTrigger>
      <SelectContent>
        {wallets.map((wallet) => (
          <SelectItem key={wallet.id} value={wallet.id}>
            {wallet.address}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
