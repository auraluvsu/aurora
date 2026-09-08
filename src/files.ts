import * as fs from "fs";

fs.readFile("myfile.json", "utf8", (err, data) => {
    if (err) {
        console.error("Error reading file:", err);
        return;
    }
    console.log("File content:", JSON.parse(data));
});
