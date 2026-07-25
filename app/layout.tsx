import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { RecipeCommandMenu } from "@/components/recipe-command-menu";
import { getAllRecipes } from "@/lib/recipes";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Recipes",
  description: "Personal recipe collection",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const recipes = await getAllRecipes();

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        {children}
        <RecipeCommandMenu recipes={recipes} />
      </body>
    </html>
  );
}
