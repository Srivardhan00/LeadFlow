import axios from "axios";
import { useEffect } from "react";

function App() {

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:8080/test");
        console.log("Response from backend:", response.data);
      } catch (error) {
        console.error("Error fetching data from backend:", error);
      }
    }
    fetchData();
  }, []);

  return <h1>LeadFlow</h1>;
}

export default App;