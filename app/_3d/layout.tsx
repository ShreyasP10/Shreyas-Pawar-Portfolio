import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shreyas Pawar — 3D Workspace",
  description:
    "Interactive 3D portfolio workspace built with React Three Fiber, featuring custom physics, realistic lighting, and interactive device screens.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
