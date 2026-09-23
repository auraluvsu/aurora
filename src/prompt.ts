import * as fs from "fs/promises";
import { msgFmt } from "./types";

export let profileHeader: msgFmt[] = [
    { role: "user", content: "" },
    { role: "assistant", content: "" },
];

export async function cacheNewMem() {
    const pStat = await fs.stat("./history/prompt.txt");
    const cStat = await fs.stat("./history/header-cache.json");
    if (pStat.mtimeMs === cStat.mtimeMs) return;
}

export async function receiveHeader(header: msgFmt[], memory: string) {
    try {
        const requestBody = {
            messages: [{ role: "user", content: memory }],
        };

        const res = await fetch("http://localhost:8080/v1/chat/completions", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(requestBody),
        });

        profileHeader[0]!.content = memory;
        const json = await res.json();
        profileHeader[1]!.content = json.choices[0]!.message.content;
    } catch (err) {
        console.error("Error receiving header:", err);
    }
}
