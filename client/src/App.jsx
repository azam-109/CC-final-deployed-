import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/home';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Questions from './pages/Questions';
import AskQuestion from './pages/AskQuestion';
import Answer from './pages/Answer'; 
import Profile from './pages/Profile'
import Layout from "./components/Layout";
import BlogList from "./pages/BlogList";
import CreateBlog from "./pages/CreateBlog";
import Inbox from "./pages/Inbox";
import ChatWindow from "./pages/ChatWindow";
import BlogDetails from "./pages/BlogDetails";

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/questions" element={<Questions />} />
            <Route path="/askquestion" element={<AskQuestion />} />
            <Route path="/questions/:id" element={<Answer />} /> 
            <Route path="/profile/:id" element={<Profile />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/blogs" element={<BlogList />} />
            <Route path="/blogs/create" element={<CreateBlog />} />
            <Route path="/blogs/:id" element={<BlogDetails />} />
            <Route path="/inbox" element={<Inbox />} />
            <Route path="/chat/:conversationId" element={<ChatWindow />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
