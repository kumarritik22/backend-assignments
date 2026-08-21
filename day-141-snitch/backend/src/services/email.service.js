import axios from "axios";
import { config } from "../config/config.js";

export const sendEmail = async ({ to, toName, subject, htmlContent, textContent }) => {
    const response = await axios.post("https://api.brevo.com/v3/smtp/email", 
        {
            sender: {
                name: config.BREVO_SENDER_NAME,
                email: config.BREVO_SENDER_EMAIL
            },
            to: [
                {
                    email: to,
                    name: toName
                }
            ],
            subject,
            htmlContent,
            textContent
        },
        {
            headers: {
                accept: "application/json",
                "api-key": config.BREVO_API_KEY,
                "content-type": "application/json"
            } 
        }
    );

    return response.data;
};