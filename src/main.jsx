// import { h } from "preact";
import { render } from "preact";
import App from "./App";

import "leaflet-css";

// Initialize the app
function init() {
    const app = document.getElementById("app");
    if (app) {
        render(<App />, app);
    }
}

// Load the app
if (document.readyState !== "loading") {
    init();
} else {
    document.addEventListener("DOMContentLoaded", init);
}
