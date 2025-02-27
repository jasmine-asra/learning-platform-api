import app from "./index";
import config from "./config/config";

// Start Server
app.listen(config.port, () => {
    console.log(`Server running on http://localhost:${config.port}`);
});