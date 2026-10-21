import { axiosInstance } from './config/AxiosInstance.jsx';

const App = () => {

  const getData = async () => {
    try {
      const response = await axiosInstance.get("/products");
      console.log("This is App UI -->", response);
    } catch (error) {
      console.error("Error while calling api:", error);
    }
  };

  getData();

  return (
    <div>
      <h1>Hello from React!</h1>
    </div>
  )
}

export default App
