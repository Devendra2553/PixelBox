import React from "react";
import Navbar from "./Navbar";
import CardGrid from "./CardsGrid";
import Footer from "./Footer";

function Home() {
  return (
    <>
      {/* Background Layer */}
      <div className="fixed inset-0 -z-10 h-full w-full bg-white">
        <div className="absolute inset-0 bg-[url('/images/bg.png')] bg-cover bg-center opacity-40"></div>
      </div>

      {/* Content Layer */}
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
