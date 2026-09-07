import * as fs from "fs/promises";

type msgFmt = { role: string; content: string };
let history: msgFmt[] = [];

async function writeToFile(filePath: string, data: msgFmt[]): Promise<void> {
  try {
    const jsonString = JSON.stringify(data, null, 2);
    await fs.writeFile(filePath, jsonString, "utf-8");

    console.log("File written");
  } catch (err) {
    console.error("Failed to write to file:", err);
  }
}

async function fetching(message: string) {
  const rawJson = await fs.readFile("./myfile.json", "utf-8");
  rawJson ? (history = JSON.parse(rawJson)) : (history = []);
  history.push({ role: "user", content: message });

  console.log("MESSAGE:", message);

  const requestBody = {
    messages: history,
  };

  return await fetch("http://localhost:8080/v1/chat/completions", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(requestBody),
  });
}

async function main(message: string) {
  const res = await fetching(message);
  const json = await res.json();
  const response = [];

  for (const ch of json.choices) {
    response.push(ch.message.content);
  }
  history.push({ role: "assistant", content: response[0] });
  await writeToFile("./myfile.json", history);

  console.log(response);
}

async function read() {
  await main("/no_think Hello, how are you?");
  await main("/no_think What was the first question i asked you?");
  // await main("/no_think What were the two questions i just asked?");
}

read().catch((e) => console.log("Error:", e));
