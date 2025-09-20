import client from "./client";

// Create a demo user for the mobile app
export const createDemoUser = async () => {
  try {
    const { data } = await client.post("/api/users", {
      email: "demo@mobile-app.com",
      name: "Demo Mobile User",
    });
    return data;
  } catch (error) {
    console.error("Failed to create demo user:", error);
    throw error;
  }
};

// Get or create demo user
export const getOrCreateDemoUser = async () => {
  try {
    // Try to get existing demo user
    const { data } = await client.get("/api/users?email=demo@mobile-app.com");
    if (data && data.length > 0) {
      return data[0];
    }
    
    // Create new demo user if none exists
    return await createDemoUser();
  } catch (error) {
    console.error("Failed to get or create demo user:", error);
    throw error;
  }
};
