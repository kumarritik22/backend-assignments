import { useLocation, useNavigate, Link } from "react-router";
import { useEffect } from "react";
import { CheckCircle, Package, ArrowRight } from "lucide-react";

const OrderSuccess = () => {
    const location = useLocation();
    const navigate = useNavigate();
    
    const queryParams = new URLSearchParams(location.search);
    const orderId = queryParams.get("order_id");

    // Redirect to home if accessed directly without an order ID
    useEffect(() => {
        if (!orderId) {
            navigate("/");
        }
    }, [orderId, navigate]);

    if (!orderId) return null;

    return (
        <div className="min-h-[80vh] flex items-center justify-center bg-[#0c0c0c] px-4 py-12">
            <div className="max-w-2xl w-full text-center space-y-8 animate-fade-in-up">
                
                {/* Success Icon */}
                <div className="flex justify-center">
                    <div className="relative">
                        <div className="absolute inset-0 bg-gold blur-xl opacity-20 rounded-full"></div>
                        <CheckCircle className="w-24 h-24 text-gold relative z-10" strokeWidth={1.5} />
                    </div>
                </div>

                {/* Header */}
                <div className="space-y-4">
                    <h1 className="text-4xl md:text-5xl font-['Bodoni_Moda'] text-white">
                        Thank You For Your Order
                    </h1>
                    <p className="text-[#888888] font-['Inter'] text-lg">
                        Your payment was successful and your luxury pieces are being prepared.
                    </p>
                </div>

                {/* Order Details Card */}
                <div className="bg-[#111111] border border-[#2A2A2A] rounded-xl p-8 max-w-md mx-auto relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-transparent via-gold to-transparent opacity-50"></div>
                    
                    <div className="flex flex-col items-center space-y-2">
                        <span className="text-[#888888] text-sm uppercase tracking-widest font-semibold">Order Reference</span>
                        <span className="text-white font-mono text-xl tracking-wider bg-[#1A1A1A] px-4 py-2 rounded-lg border border-[#333333]">
                            {orderId}
                        </span>
                    </div>

                    <div className="mt-8 pt-8 border-t border-[#2A2A2A] text-left space-y-4">
                        <div className="flex items-start gap-4">
                            <div className="bg-[#1A1A1A] p-2 rounded-lg text-gold">
                                <Package className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="text-white font-medium mb-1">What happens next?</h3>
                                <p className="text-[#888888] text-sm leading-relaxed">
                                    You will receive an email confirmation with your order details shortly. We will notify you again once your package has been dispatched.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                    <Link 
                        to="/profile/orders"
                        className="w-full sm:w-auto px-8 py-4 bg-gold text-black font-semibold tracking-wider text-sm hover:bg-[#b5955b] transition-colors rounded-sm flex items-center justify-center gap-2"
                    >
                        VIEW ORDER DETAILS
                    </Link>
                    <Link 
                        to="/"
                        className="w-full sm:w-auto px-8 py-4 bg-transparent border border-[#333333] text-white font-semibold tracking-wider text-sm hover:border-white hover:bg-white hover:text-black transition-all rounded-sm flex items-center justify-center gap-2"
                    >
                        CONTINUE SHOPPING <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>

                <div className="pt-8">
                    <p className="text-[#555555] text-sm">
                        Need assistance? <Link to="/contact" className="text-gold hover:underline">Contact our concierge</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default OrderSuccess;
