import Link from "next/link";

export default function Home() {
  return (
    <main className="w-screen h-screen flex items-center justify-center">
      Check out the example form <Link href="/form/step1">here.</Link>
    </main>
  );
}
