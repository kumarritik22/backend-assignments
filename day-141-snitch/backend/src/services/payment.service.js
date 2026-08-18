import Razorpay from "razorpay";
import { config } from "../config/config";

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY.KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});

export const createOrder = async ({amount, currency="INR" }) => {
    
    const options = ({
        amount: amount * 100,
        currency
    })

    const order = await razorpay.orders.create(options)

    return order;
}