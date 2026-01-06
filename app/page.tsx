
import { Navbar } from "@/components/features/Navbar";
import { AddLink } from "@/components/features/AddLink";
import { db } from "@/db";
import { links } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";
import { desc, eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { LinkVault } from "@/components/features/LinkVault";
import { PageTransition } from "@/components/ui/PageTransition";

export const dynamic = "force-dynamic";

async function getLinks(userId: string) {
  return db.select()
    .from(links)
    .where(eq(links.userId, userId))
    .orderBy(desc(links.createdAt));
}

export default async function Home() {
  const { userId } = await auth();

  const userLinks = userId ? await getLinks(userId) : [];

  return (
    <PageTransition className="max-w-xl mx-auto py-8 px-6 min-h-screen flex flex-col">
      <Navbar />

      <header className="mb-16 mt-16 text-center space-y-2">
        <h1 className="text-4xl font-serif text-foreground/90">
          {(() => {
            const hour = new Date().getHours();
            const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
            return userId ? `${greeting}, Abhishek` : greeting;
          })()}
        </h1>
      </header>

      <main className="flex-1">
        <AddLink />
        <div className="mt-16">
          <LinkVault links={userLinks} />
        </div>
      </main>

      <footer className="mt-20 pt-8 border-t border-border/20 text-center">
        <p className="text-sm text-muted-foreground/40 font-mono hover:text-muted-foreground/60 transition-colors cursor-default">
          Copyright @ Abhishek Singh
        </p>
      </footer>
    </PageTransition>
  );
}
