import { Screen } from "@/components/Screen"; 

export default function Home() {
  return (
    <div>
      <main className="w-full flex flex-col items-center">
        <h1 className="text-2xl font-bold my-5">Cinema bookings</h1>
        <Screen />
      </main>
      <footer>
      </footer>
    </div>
  );
}
