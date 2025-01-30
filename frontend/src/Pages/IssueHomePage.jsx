// IssueHomePage.js
import React, { useEffect, useState } from "react";
import IssueCard from "../Component/IssueCard";
import Footer from "../Component/Footer";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { getAllIssues, setSearchResults, clearSearchResults } from "../redux/slices/issueSlice";

const IssueHomePage = () => {
  const [allIssues, setAllIssues] = useState([]);
  const dispatch = useDispatch();

  // Get issues and search results from Redux
  const searchResults = useSelector((state) => state.issue.searchResults);

  // Fetch all issues on component mount
  useEffect(() => {
    const fetchAllIssues = async () => {
      try {
        const response = await axios.get("https://community-problem-tracker-3.onrender.com/api/v1/issues/get-all-issues");
        if (response.data.success) {
          dispatch(getAllIssues(response.data.issues));
          setAllIssues(response.data.issues);
        }
      } catch (error) {
        toast.error("Failed to fetch issues.");
      }
    };

    fetchAllIssues();

    // Clear search results when the component unmounts
    return () => {
      dispatch(clearSearchResults());
    };
  }, [dispatch]);

  // Determine which issues to display (search results or all issues)
  const issuesToDisplay = searchResults?.length > 0 ? searchResults : allIssues;
  
  return (
    <div className="w-full bg-white">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 mt-20">
        {issuesToDisplay.length > 0 ? (
            [...issuesToDisplay]
            .reverse() // Display issues in descending order
            .map((issue) => (
              <IssueCard key={issue._id} issue={issue} />
            ))
        ) : (
          <p>No issues found.</p>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default IssueHomePage;