import Link from "next/link";

export default function Home() {
  return (
    <main className="w-screen h-screen flex items-center justify-center text-4xl">
      <Link href="/form/step1">Check out the example form here.</Link>
    </main>
  );
}
