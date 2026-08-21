"use client";

/**
 * Bản đồ công khai — chỉ xem, không ra lệnh được. Mọi thao tác điều hành nằm ở
 * console GM tại `/gm`.
 */

import { useEffect, useState } from "react";
import Link from "next/link";
import { BoardCanvas } from "@/components/BoardCanvas";
import { BoardPanel } from "@/components/BoardPanel";
import { IconTrophy } from "@/components/icons";
import { loadSavedGame } from "@/game/persistence";
import { createDefaultGame } from "@/game/setup";
import { startGame } from "@/game/resolve";
import { FACTION_LABEL } from "@/game/theme";
import { GameState } from "@/game/types";
import { VisionMode } from "@/game/vision";

export default function Home() {
  const [state, setState] = useState<GameState | null>(null);
  const [note, setNote] = useState<string | null>(null);
  const [selectedTile, setSelectedTile] = useState<string | null>(null);
  const [activeCommanderId, setActiveCommanderId] = useState<string | null>(null);
  const [visionMode, setVisionMode] = useState<VisionMode>("spectator");

  useEffect(() => {
    let cancelled = false;
    loadSavedGame()
      .then((saved) => {
        if (cancelled) return;
        if (saved) {
          setState(saved);
        } else {
          setState(startGame(createDefaultGame()));
          setNote("Chưa có ván nào được lưu — đang hiển thị thế trận khởi đầu.");
        }
      })
      .catch((error: Error) => {
        if (cancelled) return;
        setState(startGame(createDefaultGame()));
        setNote(error.message);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (!state) {
    return (
      <main className="flex h-screen w-screen items-center justify-center bg-ink text-secondary">
        Đang tải thế trận…
      </main>
    );
  }

  const winner = state.victory.winner;

  return (
    <main className="relative h-screen w-screen bg-ink">
      {winner && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
          <div className="rounded-xl border-2 border-gold bg-panel px-12 py-10 text-center shadow-2xl shadow-black/60">
            <IconTrophy size={48} className="mx-auto mb-2" />
            <div
              className="font-display text-6xl font-bold text-gold"
              style={{ textShadow: "0 0 30px rgba(232,192,64,0.4)" }}
            >
              {FACTION_LABEL[winner]}
            </div>
            <div className="mt-2 text-lg text-primary">
              {state.victory.reason === "CONQUEST"
                ? "thống nhất thiên hạ!"
                : "thắng theo điểm!"}
            </div>
          </div>
        </div>
      )}

      <div className="pointer-events-none fixed left-4 top-4 z-10 flex max-h-[calc(100vh-2rem)] flex-col gap-2 overflow-y-auto">
        <BoardPanel
          state={state}
          selectedTile={selectedTile}
          activeCommanderId={activeCommanderId}
          visionMode={visionMode}
          onSetVisionMode={setVisionMode}
          onSelectCommander={setActiveCommanderId}
        />
        {note && (
          <div className="pointer-events-auto w-[340px] rounded-md border border-line bg-panel/95 p-2 text-[11px] text-secondary">
            {note}
          </div>
        )}
      </div>

      <Link
        href="/gm"
        className="fixed right-4 top-4 z-10 rounded border border-line bg-panel/95 px-3 py-1.5 text-xs text-secondary transition-colors hover:border-gold/60 hover:text-gold"
      >
        Console GM →
      </Link>

      <BoardCanvas
        state={state}
        selectedTile={selectedTile}
        activeCommanderId={activeCommanderId}
        visionMode={visionMode}
        onSelectTile={setSelectedTile}
        onSelectCommander={setActiveCommanderId}
      />
    </main>
  );
}
