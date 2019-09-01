import React from "react";
import { BrowserRouter, Route } from "react-router-dom";
import StationDetail from "./pages/StationDetail";
import StationSearch from "./pages/StationSearch";
import SelectAsync from "./pages/AsyncSelect";

export default function Routes() {
    return (
        <BrowserRouter>
            <Route path="/" exact component={StationSearch} />
            <Route path="/station/:stationNumber" component={StationDetail} />
            <Route path="/select/comp" component={SelectAsync} />
        </BrowserRouter>
    );
}