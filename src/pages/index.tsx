import { Actions } from "@/components/Actions";
import { States } from "@/components/States";
import { loadFromStorage } from "@/store/store";
import { useEffect, useState } from "react";
import Image from "next/image";
import favicon from "@/../public/favicon-96x96.png";
import { Link } from "@mui/material";
import { Motivations } from "@/components/Motivations";
import { Triggers } from "@/components/Triggers";
import { Finale } from "@/components/Finale";

type View = "triggers" | "states" | "actions" | "motivations" | "finale";

// const startupDelay = 10000; // force you to take a deep breath
const startupDelay = 1000; // debugging

export default function Home() {
  const [view, setView] = useState<View>("triggers");
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
          <Link
            component="button"
            color="textPrimary"
            className={"text-sm" + (view === "triggers" ? " !font-bold" : "")}
            onClick={() => setView("triggers")}
          >
            Why Did
          </Link>
          <Link
            component="button"
            color="textPrimary"
            className={"text-sm" + (view === "states" ? " !font-bold" : "")}
            onClick={() => setView("states")}
          >
            What Am
          </Link>
          <Link
            component="button"
            color="textPrimary"
            className={"text-sm" + (view === "actions" ? " !font-bold" : "")}
            onClick={() => setView("actions")}
          >
            What Do
          </Link>
          <Link
            component="button"
            color="textPrimary"
            className={"text-sm" + (view === "motivations" ? " !font-bold" : "")}
            onClick={() => setView("motivations")}
          >
            Why Do
          </Link>
        </div>
      </div>

      <div className="w-full grow p-2 min-h-0">
        {view === "triggers" ? (
          <Triggers next={() => setView("states")} />
        ) : view === "states" ? (
          <States next={() => setView("actions")} />
        ) : view === "actions" ? (
          <Actions next={() => setView("finale")} />
        ) : view === "motivations" ? (
          <Motivations next={() => setView("finale")} />
        ) : (
          <Finale />
        )}
      </div>
    </div>
  );
}
