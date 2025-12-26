import { ClerkProvider } from "@clerk/nextjs";

import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <ClerkProvider>
      <Navbar />
      <main className="bg-background text-foreground">{children}</main>
      <Footer />
    </ClerkProvider>
  );
};

export default Layout;
