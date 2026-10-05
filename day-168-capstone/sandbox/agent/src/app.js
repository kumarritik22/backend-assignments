import express from "express";
import morgan from "morgan";
import fs from "fs";

const app = express();

const WORKING_DIR = "/workspace";

app.use(express.json());
app.use(morgan("dev"));

app.get("/", (req, res) => {
    res.status(200).json({
        message: "Hello from sandbox agent!"
    });
});


app.get("/list-files", async (req, res) => {

    const elements = await fs.promises.readdir(WORKING_DIR);

    res.status(200).json({
        message: "Elements in working directory.",
        elements
    });
});


// @route GET /read-files 
// @description Read the content of all files requested in the query parameter "files" and returns their content as a JSON Object.
// - eg. /read-files?files=file1.txt,/src/file2.txt
app.get("read-files", async (req, res) => {

    const files = req.query.files;

    if (!files) {
        return res.status(400).json({
            message: "No files specified in query parameter.",
            status: "error"
        });
    }

    const fileList = files.split(",");

    const results = await Promise.all(fileList.map(async (file) => {
        
        const filePath = path.join(WORKING_DIR, file);

        try {
            const content = await fs.promises.readFile(filePath, "utf-8");
            return {
                [ filePath ] : content
            }
        } catch (error) {
            return {
                [ filePath ]: `Error reading file: ${error.message}`
            }
        }
    }));

    res.status(200).json({
        message: "File contents.",
        files: results
    });
});

export default app;