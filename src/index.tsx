import * as React from "react";
import { render } from "react-dom";
import { Provider } from "react-redux";

import { Main } from "./components/main";
import { store } from "./store";

window.onload = () => render(<Provider store={store}><Main /></Provider>, document.getElementById("app"));
