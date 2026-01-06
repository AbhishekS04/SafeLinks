
import { Navbar } from "@/components/features/Navbar";
import { AddLink } from "@/components/features/AddLink";
import { db } from "@/db";
import { links } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";
import { desc, eq } from "drizzle-orm";
import { redirect } from "next/navigation";

async function getLinks() {
  const { userId } = await auth();
  if (!userId) return [];

  return db.select()
    .from(links)
    .where(eq(links.userId, userId))
    .orderBy(desc(links.createdAt));
}

import { LinkVault } from "@/components/features/LinkVault";

export default async function Home() {
  const { userId } = await auth();
  const userLinks = await getLinks();

  return (
    <div className="flex flex-col gap-8 min-h-screen">
      <Navbar />

      <div className="flex-1 flex flex-col gap-8">
        <section className="flex flex-col gap-1">
          <h1 className="text-3xl font-serif italic text-foreground tracking-tight">
            My Vault
          </h1>
          <p className="text-muted-foreground text-sm">
            {userLinks.length} items collected
          </p>
        </section>

        {userId && <AddLink />}

        {/* Client-side Link Vault with Animations & Pagination */}
        <LinkVault links={userLinks} />
      </div>
    </div>
  );
}
