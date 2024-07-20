// src/hooks/useApi.js
import { useState, useEffect } from 'react';

function useApi(apiCall) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    apiCall()
      .then(response => {
        setData(response.data);
        setLoading(false);
      })
      .catch(err => {
        setError('An error occurred');
        setLoading(false);
        console.error('API call error:', err);
      });
  }, [apiCall]);

  return { data, loading, error };
}

export default useApi;