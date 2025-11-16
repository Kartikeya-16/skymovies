import "swiper/css";
import "swiper/css/autoplay";
import "./assets/boxicons-2.0.7/css/boxicons.min.css";
import "./App.scss";

import { BrowserRouter } from "react-router-dom";
import { SignedIn, SignedOut, RedirectToSignIn } from "@clerk/clerk-react";

import Header from "./components/header/Header";
import Footer from "./components/footer/Footer";

import Routes from "./routes/Routes";

function App() {
  return (
    <BrowserRouter>
      {/* Show sign-in page if user is not authenticated */}
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>

      {/* Show main app only if user is authenticated */}
      <SignedIn>
        <Header />
        <Routes />
        <Footer />
      </SignedIn>
    </BrowserRouter>
  );
}

export default App;
