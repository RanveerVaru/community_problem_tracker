import React from 'react'
import {Routes , Route} from "react-router-dom";
import LoginPage from "./Pages/LoginPage";
import NotFoundPage from "./Pages/NotFoundPage";
import DashboardPage from "./Pages/DashboardPage";
import MyIssuesPage from "./Pages/MyIssuesPage";
import SignUpPage from './Pages/SignUpPage';
import IssueHomePage from './Pages/IssueHomePage';
import IssueForm from "./Component/IssueForm";
import { Toaster } from 'react-hot-toast';
import Header from './Component/Header';
import SearchResults from './Pages/SearchResults';

const App = () => {
  return (
    <div >
      <Header />
      <Routes>
        <Route path="/" element={<IssueHomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/admin-dashboard" element={<DashboardPage />} />
        <Route path="/my-issues" element={<MyIssuesPage />} />
        <Route path="/search" element={<SearchResults />} />
        <Route path="/issue-form/:id?" element={<IssueForm />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <Toaster />
    </div>
  )
}

export default App;
