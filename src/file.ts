import * as fs from "fs/promises";
import { msgFmt } from "./types";

export async function writeToFile(filePath: string, data: msgFmt[]): Promise<void> {
    try {
        const jsonString = JSON.stringify(data, null, 2);
        await fs.writeFile(filePath, jsonString, "utf-8");

        console.log("File written");
    } catch (err) {
        console.error("Failed to write to file:", err);
    }
}

export async function readFromFile(filePath: string): Promise<msgFmt[] | void> {
    try {
        const file = await fs.readFile(filePath, "utf-8");
        const json: msgFmt[] = JSON.parse(file ?? []);
        return json;
    } catch (err) {
        console.error("Failed to read from file:", err);
        return;
    }
}
