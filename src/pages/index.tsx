import { Button } from "@mui/material";
import { Roboto } from "next/font/google";

const roboto = Roboto({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
});

export default function Home() {
  return (
    <main className={`${roboto.className} flex items-center justify-center h-svh w-svw bg-sky-400`}>
      <Button variant="contained">Click me</Button>
    </main>
  );
}
