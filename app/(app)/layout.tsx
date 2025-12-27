import { ClerkProvider } from "@clerk/nextjs";

import { CartDrawer } from "@/components/cart/cart-drawer";
import { ChatSheet } from "@/components/chat-sheet";
import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { CartStoreProvider } from "@/lib/store/cart-store-provider";
import { ChatStoreProvider } from "@/lib/store/chat-store-provider";
import { SanityLive } from "@/sanity/lib/live";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <ClerkProvider>
      <CartStoreProvider>
        <ChatStoreProvider>
          <Navbar />
          <main className="bg-background text-foreground">{children}</main>
          <CartDrawer />
          <ChatSheet />
          <SanityLive />
        </ChatStoreProvider>
      </CartStoreProvider>
      <Footer />
    </ClerkProvider>
  );
};

export default Layout;
