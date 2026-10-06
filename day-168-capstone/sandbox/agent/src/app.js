import express from "express";
import morgan from "morgan";
import fs from "fs";
import path from "path";

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
app.get("/read-files", async (req, res) => {
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


// @route PATCH /update-files
// @description Updates the content of files specified in the request body. The request body should be a JSON array of objects, each object should have a "file" property specifying the file path (relative to the working directory) and a "content" property specifying the new content for the file.
app.patch("/update-files", async (req, res) => {
    const updates = req.body.updates;

    if (!updates || !Array.isArray(updates)) {
        return res.status(400).json({
            message: "Invalid request body. Expected a JSON object with an 'updates' property containing an array of file updates.",
            status: "error"
        })
    }

    const results = await Promise.all(updates.map(async (update) => {
        const { file, content } = update;

        const filePath = path.join(WORKING_DIR, file);

        try {
            await fs.promises.mkdir(path.dirname(filePath), { recursive: true });
            await fs.promises.writeFile(filePath, content, "utf-8")
            return {
                [ filePath ] : "File updates successfully."
            }
        } catch (error) {
            return {
                [ filePath ] : `Error updating file: ${error.message}`
            }
        }
    }))

    res.status(200).json({
        message: "File update results",
        results
    })
});


// @route POST /create-files
// @description Creates new files with the content specified in the request body. The request body should contain a property "files" with a JSON Array of objects, each object should have a "file" property specifying the file path (relative to the working directory) and a content property specifying the content for the new file.
app.post("/create-files", async (req, res) => {
    const files = req.body.files;

    if (!files || !Array.isArray(files)) {
        return res.status(400).json({
            message: "Invalid request body. Expected a JSON object with a 'files' property containing an array of file objects.",
            status: "error"
        })
    }

    const results = await Promise.all(files.map(async (fileObj) => {
        const { file, content } = fileObj;
        const filePath = path.join(WORKING_DIR, file);

        try {
            await fs.promises.mkdir(path.dirname (filePath), { recursive : true });
            await fs.promises.writeFile(filePath, content, "utf-8")
            return {
                [ filePath ] : "File created successfully."
            }
        } catch (error) {
            return {
                [ filePath ] : `Error creating file: ${error.message}`
            }
        }
    }))

    res.status(200).json({
        message: "File creation results.",
        results
    })
});

export default app;