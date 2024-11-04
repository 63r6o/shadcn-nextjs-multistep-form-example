"use client";
import dynamic from "next/dynamic";

const MultistepFormContextProvider = dynamic(
  () => import("./multistep-form-context"),
  {
    ssr: false,
  },
);

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="w-screen h-screen flex items-center">
      <MultistepFormContextProvider>{children}</MultistepFormContextProvider>
    </main>
  );
}
