import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center py-20">
      <SignUp
        appearance={{
          elements: {
            rootBox: "mx-auto",
            card: "bg-card border border-border shadow-none",
            headerTitle: "font-display text-2xl font-light text-foreground",
            headerSubtitle: "text-muted-foreground font-[Inter,sans-serif] text-sm",
            socialButtonsBlockButton:
              "bg-secondary border border-border text-foreground hover:bg-muted font-[Inter,sans-serif] text-sm",
            socialButtonsBlockButtonText: "font-[Inter,sans-serif]",
            dividerLine: "bg-border",
            dividerText: "text-muted-foreground font-[Inter,sans-serif] text-xs",
            formFieldLabel:
              "text-foreground font-[Inter,sans-serif] text-sm tracking-wide",
            formFieldInput:
              "bg-secondary border-border text-foreground font-[Inter,sans-serif] focus:ring-accent focus:border-accent",
            formButtonPrimary:
              "bg-foreground text-background hover:bg-foreground/90 font-[Inter,sans-serif] text-sm tracking-wider uppercase",
            footerActionLink: "text-accent hover:text-accent/80 font-[Inter,sans-serif]",
            identityPreviewText: "text-foreground font-[Inter,sans-serif]",
            identityPreviewEditButton: "text-accent hover:text-accent/80",
            formFieldInputShowPasswordButton: "text-muted-foreground hover:text-foreground",
            alert: "bg-destructive/10 border-destructive/20 text-destructive",
          },
        }}
      />
    </div>
  );
}
