"use server";

import { db } from "@/db";
import { links } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { desc, eq, ilike, or, and } from "drizzle-orm";

// Type definition for the form state
export type LinkFormState = {
    message?: string;
    success?: boolean;
};

export async function addLink(prevState: LinkFormState, formData: FormData): Promise<LinkFormState> {
    const { userId } = await auth();

    if (!userId) {
        return { success: false, message: "Unauthorized" };
    }

    let url = formData.get("url") as string;
    const title = formData.get("title") as string;
    const italicKeyword = formData.get("italicKeyword") as string;
    const contextNote = formData.get("contextNote") as string;
    const category = formData.get("category") as string;

    // Basic sanitization
    if (url && !url.startsWith('http') && url.includes('.')) {
        url = `https://${url}`;
    }

    if (!url || !title) {
        return { success: false, message: "URL and Title are required" };
    }

    try {
        // Check for duplicates
        const existingLink = await db
            .select()
            .from(links)
            .where(and(eq(links.userId, userId), eq(links.url, url)))
            .limit(1);

        if (existingLink.length > 0) {
            revalidatePath("/"); // Ensure revalidation even if link exists
            return { message: "Link already collected.", success: false };
        }

        await db.insert(links).values({
            userId,
            url,
            title,
            category: category || "General",
            italicKeyword: italicKeyword || null,
            contextNote: contextNote || null,
        });

        revalidatePath("/");
        return { message: "Link collected.", success: true };
    } catch (error) {
        console.error("Failed to add link:", error);
        return { success: false, message: "Failed to save link" };
    }
}

export async function deleteLink(linkId: string) {
    const { userId } = await auth();
    if (!userId) {
        return { success: false, message: "Unauthorized" };
    }

    try {
        await db.delete(links)
            .where(and(eq(links.id, linkId), eq(links.userId, userId)));

        revalidatePath("/");
        return { success: true, message: "Link deleted" };
    } catch (error) {
        console.error("Failed to delete link:", error);
        return { success: false, message: "Failed to delete link" };
    }
}

export async function searchLinks(query: string) {
    const { userId } = await auth();
    if (!userId || !query) return [];

    // Simple case-insensitive search
    const allLinks = await db.select().from(links).where(eq(links.userId, userId));

    // Perform filtering in JS for flexibility with small datasets (or use ilike in SQL if refined)
    const lowerQuery = query.toLowerCase();
    return allLinks.filter(link =>
        link.title.toLowerCase().includes(lowerQuery) ||
        (link.italicKeyword && link.italicKeyword.toLowerCase().includes(lowerQuery)) ||
        (link.category && link.category.toLowerCase().includes(lowerQuery)) ||
        new URL(link.url).hostname.includes(lowerQuery)
    ).slice(0, 5); // Limit results
}

// Stub for metadata fetching (will implement with actual scraping logic later)
export async function fetchMetadata(url: string) {
    "use server";
    // basic validation
    if (!url) return null;

    // Simulate delay
    // await new Promise(r => setTimeout(r, 1000));

    // Basic heuristics (Real impl would use cheerio/fetch)
    try {
        const response = await fetch(url);
        const html = await response.text();

        // Very naive regex for demo purposes
        const titleMatch = html.match(/<title>(.*?)<\/title>/);
        const title = titleMatch ? titleMatch[1] : new URL(url).hostname;

        return {
            title: title.trim(),
            domain: new URL(url).hostname,
        }
    } catch (e) {
        return {
            title: "",
            domain: "",
        }
    }
}
