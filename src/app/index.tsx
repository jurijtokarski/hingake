import { Component, h } from "preact";

import Background from "./Background";
import Animation from "./Animation";

class App extends Component<{}, {}> {
    constructor() {
        super();
    }

    render() {
        return (
            <Background>
                <Animation />
            </Background>
        );
    }
}

export default App;
