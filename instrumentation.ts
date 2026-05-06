export async function register() {
  console.log("🚀 INIT RUNNING (server start)")

   console.log("🚀 Trigger init")

  setTimeout(() => {
    fetch( `http://localhost:${process.env.PORT}` + "/api_local/init")
      .then(() => console.log("✅ Init called"))
      .catch(err => console.error("❌ Init error:", err))
  }, 1000) // kasih delay biar server ready
}