import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";

const SearchResults = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const searchQuery = queryParams.get("title");

  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchIssues = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`https://community-problem-tracker-3.onrender.com/api/v1/issues/search?title=${encodeURIComponent(searchQuery)}`);
        setIssues(response.data.issues);
      } catch (err) {
        setError("Error fetching search results. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    if (searchQuery) {
      fetchIssues();
    }
  }, [searchQuery]);

  return (
    <div className="max-w-3xl mx-auto mt-20 p-6">
      <h2 className="text-2xl font-semibold mb-4">Search Results for "{searchQuery}"</h2>

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : issues.length > 0 ? (
        <ul className="space-y-4">
          {issues.map((issue) => (
            <li key={issue._id} className="p-4 bg-white border rounded-lg shadow-md">
              <h3 className="text-xl font-semibold">{issue.title}</h3>
              <p className="text-gray-600">{issue.description}</p>
              <p className="text-sm text-gray-500">Posted by: {issue.createdBy}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No results found.</p>
      )}
    </div>
  );
};

export default SearchResults;
