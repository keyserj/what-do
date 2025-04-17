import { Actions } from "@/components/Actions";
import { States } from "@/components/States";
import { loadFromStorage } from "@/store";
import { useEffect, useState } from "react";
import Image from "next/image";
import favicon from "@/../public/favicon-96x96.png";
import { Link } from "@mui/material";
import { Motivations } from "@/components/Motivations";

type View = "states" | "actions" | "motivations";

const startupDelay = 10000; // force you to take a deep breath
// const startupDelay = 1000; // force you to take a deep breath

export default function Home() {
  const [view, setView] = useState<View>("states");
  const [loaded, setLoaded] = useState(false);
  const [startupDelayed, setStartupDelayed] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setStartupDelayed(true);
    }, startupDelay);

    const load = async () => {
      await loadFromStorage();
      setLoaded(true);
    };

    load();
  }, []);

  if (!loaded || !startupDelayed) {
    return <Image src={favicon} alt="home" height={32} width={32} />;
  }

  return (
    <div className="size-full flex flex-col">
      {/* header */}
      <div className="w-full flex justify-between p-2 h-12">
        <Image src={favicon} alt="home" height={32} width={32} />

        <div className="flex gap-3">
          {view !== "states" && (
            <Link
              component="button"
              className="text-sm !text-[#bc285a]"
              onClick={() => setView("states")}
            >
              States
            </Link>
          )}
          {view !== "actions" && (
            <Link
              component="button"
              color="textPrimary"
              className="text-sm"
              onClick={() => setView("actions")}
            >
              What Do
            </Link>
          )}
          {view !== "motivations" && (
            <Link
              component="button"
              color="textPrimary"
              className="text-sm"
              onClick={() => setView("motivations")}
            >
              Motivations
            </Link>
          )}
        </div>
      </div>

      <div className="w-full grow">
        {view === "states" ? <States /> : view === "actions" ? <Actions /> : <Motivations />}
      </div>
    </div>
  );
}
