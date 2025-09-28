"use client"

export default function SimplePage() {
  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <h1>Wedding Golden Egg Game</h1>
      <p>This is a simple version to test deployment.</p>
      <div style={{ marginTop: "2rem" }}>
        <div style={{ 
          width: "100px", 
          height: "100px", 
          backgroundColor: "gold", 
          borderRadius: "50%", 
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "2rem"
        }}>
          🥚
        </div>
      </div>
    </div>
  )
}
