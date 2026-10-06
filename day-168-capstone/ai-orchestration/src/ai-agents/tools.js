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

