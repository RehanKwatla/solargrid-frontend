import React from "react";

export default function SolarGridIntro() {
  return (
    <iframe
      src="/solargrid-intro.html"
      title="SolarGrid 3D Experience"
      className="fixed inset-0 w-screen h-screen border-0 m-0 p-0 overflow-hidden z-50 bg-[#5A2E25]"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        border: "none",
        margin: 0,
        padding: 0,
        zIndex: 9999,
        display: "block"
      }}
    />
  );
}
