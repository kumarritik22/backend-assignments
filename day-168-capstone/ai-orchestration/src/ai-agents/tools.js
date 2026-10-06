import axios from "axios";
import { tool } from "langchain";
import * as z from "zod";

export const listFiles = tool(
    async ({}, config) => {
        const writer = config.writer;

        writer("Listing files in the project directory...\n");

        const response = await axios.get(`http://sandbox-service-${config.context.projectId}:3000/list-files`);

        writer("Files listed successfully." + "Files: " + response.data.files.join(",") + "\n");

        return JSON.stringify(response.data.files);
    },
    {
        name: "list_files",
        description: "List all the files in the project directory. This is useful for understanding what files are available to work with.",
        schema: z.object({})
    }
);


export const readFiles = tool(
    async ({ files: [] }, config) => {
        const writer = config.writer

        writer("Reading files...", + files.join(",") + "\n");

        const response = await axios.get(`http://sandbox-service-${config.context.projectId}:3000/read-files?files=` + files.join(","));

        writer("Files read successfully. \n");

        return JSON.stringify(response.data);
    },
    {
        name: "read_files",
        description: "Read the contents of specified files. This is useful for understanding the content of files that are relevant to the task at hand.",
        schema: z.object({
            files: z.array(z.string()).describe("The list of files absolute paths to read. These should be files that were listed using the list_files tool or created later.")
        })
    }
);