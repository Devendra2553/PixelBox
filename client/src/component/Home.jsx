import React from "react";
import Navbar from "./Navbar";
import CardGrid from "./CardsGrid";
import Footer from "./Footer";

function Home() {
  return (
    <>
      <div className="min-h-screen flex flex-col pt-7">
        <Navbar/>
        <main className="grow">
          <CardGrid />
        </main>
        <Footer />
      </div>
    </>
  );
}

export default Home;
