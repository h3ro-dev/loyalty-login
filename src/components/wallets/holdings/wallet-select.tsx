
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface WalletSelectProps {
  selectedWallet: string | null;
  wallets: Array<{
    id: string;
    address: string;
    nickname: string;
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
        <SelectValue placeholder="Select a wallet">
          {selectedWallet && wallets.find(w => w.id === selectedWallet)?.nickname}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {wallets.map((wallet) => (
          <SelectItem key={wallet.id} value={wallet.id}>
            {wallet.nickname} ({wallet.address.slice(0, 6)}...{wallet.address.slice(-4)})
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
