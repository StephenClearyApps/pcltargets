import * as React from "react";
import { render } from "react-dom";
import { Provider, connect } from "react-redux";

import { Main } from "./components/Main";
import { store } from "./store";

window.onload = () => {
    const ConnectedMain = connect(x => x)(Main);
    render(<Provider store={store}><ConnectedMain /></Provider>, document.getElementById("app"));
};
