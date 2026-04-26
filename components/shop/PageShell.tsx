import type { ReactNode } from "react";
import RouteTransition from "@/components/shop/RouteTransition";
import ShopFooter from "@/components/shop/ShopFooter";

export default function PageShell({ children }: { children: ReactNode }) {
  return (
    <main className="min-h-screen bg-paper text-ink">
      <div className="section-shell pb-10 pt-0">
        <RouteTransition>
          {children}
          <ShopFooter />
        </RouteTransition>
      </div>
    </main>
  );
}
