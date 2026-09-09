import * as fs from "fs/promises";
import { roleType, msgFmt } from "./types";

let profileHeader = [
    { role: "user", content: "" },
    { role: "assistant", content: "" },
];

async function cacheNewMem() {
    const pStat = await fs.stat("./history/prompt.txt");
    const cStat = await fs.stat("./history/header-cache.json");
    if (pStat.mtimeMs === cStat.mtimeMs) return;
}

async function receiveHeader(header: { role: roleType; content: string }[], memory: string) {
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
