import { h, FunctionComponent } from "preact";

import "./ios-install.css";

import FullWindow from "../FullWindow/FullWindow";

interface IOSInstallProps {
  isVisible?: boolean;
  onClose: () => void;
}

const IOSInstall: FunctionComponent<IOSInstallProps> = ({
  isVisible,
  onClose
}) => (
  <FullWindow isVisible={isVisible} onClose={onClose}>
    <div className="ios-install__steps">
      <div className="ios-install__step">
        <p>1. Press the share button</p>
        <img src="/assets/images/install_step1.png" />
      </div>
      <div className="ios-install__step">
        <p>2. Select &quot;Add to Home Screen&quot;</p>
        <img src="/assets/images/install_step2.png" />
      </div>
      <div className="ios-install__step">
        <p>3. Press the &quot;Add&quot; button</p>
        <img src="/assets/images/install_step3.png" />
      </div>
    </div>
  </FullWindow>
);

export default IOSInstall;
