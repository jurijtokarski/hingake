import { getDaysInMS } from "@jurijtokarski/times";
import { h, FunctionComponent, Fragment } from "preact";
import { useEffect, useState } from "preact/hooks";

import "./index.css";

import {
  getNextCheckTimestamp,
  getRunCount,
  isInStandaloneMode,
  isIOS,
  setNextCheckTimestamp
} from "../utils";

import IOSInstall from "./IOSInstall";

const TopBar: FunctionComponent = () => {
  const [isVisible, setVisible] = useState(false);
  const [isIOSInstallVisible, setIOSInstallVisible] = useState(false);

  const runCount = getRunCount();
  const nextCheck = getNextCheckTimestamp();
  const isIOSDevice = isIOS();
  const isStandalone = isInStandaloneMode();

  useEffect(() => {
    if (isStandalone) {
      return;
    }

    if (!isIOSDevice) {
      return;
    }

    if (runCount < 3) {
      return;
    }

    if (nextCheck > Date.now()) {
      return;
    }

    setVisible(true);
  }, [runCount, nextCheck, isIOSDevice, isStandalone]);

  if (!isVisible) {
    return null;
  }

  const hideInstallBar = () => {
    setVisible(!isVisible);
    setNextCheckTimestamp(Date.now() + getDaysInMS(10));
  };

  const toggleIOSInstallVisible = () =>
    setIOSInstallVisible(!isIOSInstallVisible);

  return (
    <Fragment>
      <div className="topbar">
        Use Hingake offline
        <button className="topbar__install" onClick={toggleIOSInstallVisible}>
          Install
        </button>
        <button className="topbar__close" onClick={hideInstallBar} />
      </div>

      <IOSInstall
        isVisible={isIOSInstallVisible}
        onClose={toggleIOSInstallVisible}
      />
    </Fragment>
  );
};

export default TopBar;
