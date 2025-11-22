import { useEffect, useState } from "react";
import { Sparkles } from "lucide-react";

export function CelebrationAnimation({ trigger }: { trigger: boolean }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (trigger) {
      setShow(true);
      const timer = setTimeout(() => setShow(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [trigger]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
      <div className="animate-ping">
        <Sparkles className="w-12 h-12 text-chart-1" />
      </div>
    </div>
  );
}
