import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-black">
      <div className="flex flex-col gap-4">
        <Link 
          href="/fire" 
        >
          <Button className="w-full text-2xl h-20" size="lg">
            Fire 🔥
          </Button>
        </Link>
        <Link 
          href="/green-poison" 
        >
          <Button className="w-full text-2xl h-20" size="lg">
            Green Poison 🍃
          </Button>
        </Link>
      </div>
    </main>
  );
}
