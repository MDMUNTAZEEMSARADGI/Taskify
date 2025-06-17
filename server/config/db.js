import mongoose from "mongoose";

export const connectDB = async () => {
  await mongoose
    .connect(
      "mongodb+srv://mdmuntazeemsaradgi:Task25@cluster0.qee6xao.mongodb.net/TaskSystem?retryWrites=true&w=majority&appName=Cluster0"
    )
    .then(() => {
      console.log("Database connected");
    })
    .catch((error) => {
      console.log("Database not connected", error);
    });
};

// node -v
// npm list mongoose
