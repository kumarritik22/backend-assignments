import { useLocation } from "react-router";

const OrderSuccess = () => {

    const location = useLocation();
    
    const queryParams = new URLSearchParams(location.search);
    const orderId = queryParams.get("order_id");

  return (
    <div>
      OrderSuccess
    </div>
  )
}

export default OrderSuccess
