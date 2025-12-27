import { ClerkProvider } from "@clerk/nextjs";

import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { CartStoreProvider } from "@/lib/store/cart-store-provider";
import { CartDrawer } from "@/components/cart/cart-drawer";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <ClerkProvider>
      <CartStoreProvider>
        <Navbar />
        <main className="bg-background text-foreground">{children}</main>
        <CartDrawer />
      </CartStoreProvider>
      <Footer />
    </ClerkProvider>
  );
};

export default Layout;
