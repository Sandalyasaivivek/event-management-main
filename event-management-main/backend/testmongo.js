const mongoose = require("mongoose");

mongoose.connect("mongodb+srv://pandug771:zOANlNom0HWHKp44@cluster0.dnzb9.mongodb.net/eventgopi?retryWrites=true&w=majority&appName=Cluster0", {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("MongoDB connected successfully"))
.catch(err => console.error("MongoDB connection failed:", err));
