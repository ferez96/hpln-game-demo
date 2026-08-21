/**
 * Định dạng văn bản cho danh sách người chơi — cùng lối với bàn cờ và lệnh:
 *
 *   nguy chu-cong  Tào Tháo
 *   nguy quan-su   Tuân Úc
 *   nguy van       Trình Dục
 *   nguy tuong     Trương Liêu
 *
 * Số người tùy GM; engine chỉ đòi mỗi nước tối đa 1 Chủ Công và 1 Quân Sư.
 */

import { normalize } from "./orders/parse";
import { RosterEntry } from "./setup";
import { Owner, Role } from "./types";

export class RosterError extends Error {}

const KINGDOM_WORDS: Record<string, Owner> = {
  nguy: "wei",
  wei: "wei",
  thuc: "shu",
  shu: "shu",
  ngo: "wu",
  wu: "wu",
};

const ROLE_WORDS: Record<string, Role> = {
  "chu-cong": "LORD",
  chucong: "LORD",
  vua: "LORD",
  lord: "LORD",
  "quan-su": "STRATEGIST",
  quansu: "STRATEGIST",
  strategist: "STRATEGIST",
  van: "CIVIL",
  "quan-van": "CIVIL",
  quanvan: "CIVIL",
  civil: "CIVIL",
  tuong: "GENERAL",
  "tuong-quan": "GENERAL",
  tuongquan: "GENERAL",
  general: "GENERAL",
};

export function parseRoster(text: string): RosterEntry[] {
  const entries: RosterEntry[] = [];

  text.split(/\r?\n/).forEach((rawLine, index) => {
    const lineNo = index + 1;
    const line = rawLine.split("#")[0].trim();
    if (!line) return;

    const tokens = line.split(/\s+/);
    if (tokens.length < 3) {
      throw new RosterError(
        `dòng ${lineNo}: cần đủ "nước chức-vụ tên", ví dụ: nguy tuong Trương Liêu.`,
      );
    }

    const kingdom = KINGDOM_WORDS[normalize(tokens[0])];
    if (!kingdom) {
      throw new RosterError(
        `dòng ${lineNo}: không rõ nước "${tokens[0]}" (nguy / thuc / ngo).`,
      );
    }

    const role = ROLE_WORDS[normalize(tokens[1])];
    if (!role) {
      throw new RosterError(
        `dòng ${lineNo}: không rõ chức vụ "${tokens[1]}" (chu-cong / quan-su / van / tuong).`,
      );
    }

    const name = tokens.slice(2).join(" ").trim();
    if (!name) throw new RosterError(`dòng ${lineNo}: thiếu tên người chơi.`);

    entries.push({ name, kingdom, role });
  });

  if (entries.length === 0) {
    throw new RosterError("Danh sách người chơi trống.");
  }
  return entries;
}

const KINGDOM_TEXT: Record<Owner, string> = {
  wei: "nguy",
  shu: "thuc",
  wu: "ngo",
};

const ROLE_TEXT: Record<Role, string> = {
  LORD: "chu-cong",
  STRATEGIST: "quan-su",
  CIVIL: "van",
  GENERAL: "tuong",
};

export function formatRoster(entries: RosterEntry[]): string {
  const width = Math.max(
    ...Object.values(ROLE_TEXT).map((r) => r.length),
  );
  return entries
    .map(
      (entry) =>
        `${KINGDOM_TEXT[entry.kingdom].padEnd(4)} ${ROLE_TEXT[entry.role].padEnd(width)}  ${entry.name}`,
    )
    .join("\n");
}
