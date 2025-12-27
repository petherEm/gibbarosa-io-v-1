import { Package, Search, Sparkles } from "lucide-react";

interface WelcomeScreenProps {
  onSuggestionClick: (message: { text: string }) => void;
  isSignedIn: boolean;
}

const productSuggestions = [
  "Show me Hermès bags",
  "What watches do you have?",
  "Designer sunglasses",
];

const orderSuggestions = [
  "Where's my order?",
  "Show me my orders",
  "Has my order shipped?",
];

export function WelcomeScreen({
  onSuggestionClick,
  isSignedIn,
}: WelcomeScreenProps) {
  return (
    <div className="flex h-full flex-col items-center justify-center text-center px-4">
      <div className="bg-secondary p-4">
        <Sparkles className="h-8 w-8 text-accent" />
      </div>
      <h3 className="mt-4 text-lg font-light text-foreground">
        How can I help you today?
      </h3>
      <p className="mt-2 text-sm text-muted-foreground max-w-xs font-[Inter,sans-serif]">
        {isSignedIn
          ? "I can help you discover luxury pieces, check your orders, and track deliveries."
          : "I can help you discover authenticated luxury pieces by brand, category, or style."}
      </p>

      {/* Product suggestions */}
      <div className="mt-6 w-full max-w-sm">
        <div className="flex items-center justify-center gap-2 text-xs font-[Inter,sans-serif] tracking-[0.1em] uppercase text-muted-foreground mb-3">
          <Search className="h-3 w-3" />
          Discover
        </div>
        <div className="flex flex-wrap justify-center gap-2">
          {productSuggestions.map((suggestion) => (
            <button
              key={suggestion}
              type="button"
              onClick={() => onSuggestionClick({ text: suggestion })}
              className="border border-border bg-card px-3 py-1.5 text-sm text-foreground transition-colors hover:bg-secondary hover:border-accent font-light"
            >
              {suggestion}
            </button>
          ))}
        </div>
      </div>

      {/* Order suggestions - only for signed in users */}
      {isSignedIn && (
        <div className="mt-4 w-full max-w-sm">
          <div className="flex items-center justify-center gap-2 text-xs font-[Inter,sans-serif] tracking-[0.1em] uppercase text-muted-foreground mb-3">
            <Package className="h-3 w-3" />
            Your orders
          </div>
          <div className="flex flex-wrap justify-center gap-2">
            {orderSuggestions.map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                onClick={() => onSuggestionClick({ text: suggestion })}
                className="border border-accent/30 bg-accent/5 px-3 py-1.5 text-sm text-accent transition-colors hover:bg-accent/10 font-light"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
