import { useMemo } from "react";
import { useProgress } from "../components/Progress"; 
import { UNIT_BADGES } from "./badges";

export function useBadges() {
  const { completed } = useProgress();

  return useMemo(() => {
    const units = UNIT_BADGES.map((u) => ({
      ...u,
      done: u.paths.filter((p) => completed.includes(p)).length,
      total: u.paths.length,
      earned: u.paths.every((p) => completed.includes(p)),
      doneMap: Object.fromEntries(u.paths.map((p) => [p, completed.includes(p)])),
    }));
    return { units, earnedIds: units.filter((u) => u.earned).map((u) => u.id) };
  }, [completed]);
}