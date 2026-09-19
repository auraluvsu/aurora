import * as fs from "fs/promises";
import { roleType, msgFmt } from "./types";
import { writeToFile } from "./file";
import { profileHeader, receiveHeader } from "./prompt";

let history: msgFmt[] = [];

async function fetching(role: roleType, message: string) {
    history.push({ role, content: message });
    console.log("MESSAGE:", message);

    const requestBody = {
        messages: [...profileHeader, ...history],
    };

    return await fetch("http://localhost:8080/v1/chat/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
    });
}

async function main(role: roleType, message: string) {
    const res = await fetching(role, message);
    const json = await res.json();
    const response = [];

    for (const ch of json.choices) {
        response.push(ch.message.content);
    }
    history.push({ role: "assistant", content: response[0] });
    await writeToFile("./history/history.json", history);

    console.log(response);
}

async function loadHistory() {
    try {
        const rawJson = await fs.readFile("./history/history.json", "utf-8");
        rawJson ? (history = JSON.parse(rawJson)) : (history = []);
    } catch (err) {
        console.error("Error reading history:", err);
        history = [];
    }
}

async function read() {
    const mem = await fs.readFile("./history/prompt.txt", "utf-8");
    await receiveHeader(profileHeader, mem);
    await loadHistory();
    await main("user", "Hello! Who am I and what is my job?");
}

read().catch((e) => console.log("Error:", e));
