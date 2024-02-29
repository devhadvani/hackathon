import React, { useState, useEffect } from 'react';

const Hello = () => {
  const [apiResponse, setApiResponse] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/hello/');
        const data = await response.json();
        setApiResponse(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <h1>API Response:</h1>
      {apiResponse ? (
        <pre>{JSON.stringify(apiResponse, null, 2)}</pre>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default Hello;
