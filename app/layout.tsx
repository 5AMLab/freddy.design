import type { Metadata } from "next";
import "../styles/globals.css";

export const metadata: Metadata = {
  title: "freddy.design — Design on Demand, Singapore",
  description:
    "Skip the overhead of a full-time hire. Get a dedicated designer on speed dial — fast turnarounds, direct line, always on brand.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>{children}</body>
    </html>
  );
}
