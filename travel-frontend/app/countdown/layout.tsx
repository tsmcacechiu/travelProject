import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";

export const metadata: Metadata = {
  title: "生命倒數計時表",
  description: "還剩下多少時間？一個關於時間的極簡工具。",
};

export default function CountdownLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen bg-black text-white">
      <Navbar />
      <div className="pt-20">{children}</div>
    </div>
  );
}
