import { Switch } from "@/components/ui/switch";
import { Leaf } from "lucide-react";

interface VeganToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export function VeganToggle({ checked, onChange }: VeganToggleProps) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-2">
        <Leaf className="h-4 w-4 text-vegan" />
        <span className="text-sm font-medium">Vegan only</span>
      </div>
      <Switch
        checked={checked}
        onCheckedChange={onChange}
        className="data-[state=checked]:bg-vegan"
      />
    </div>
  );
}
