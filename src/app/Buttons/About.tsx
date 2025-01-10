import { h, FunctionComponent } from "preact";

import "./about.css";

import FullWindow from "../FullWindow/FullWindow";

interface AboutProps {
  isVisible?: boolean;
  onClose: () => void;
}

const About: FunctionComponent<AboutProps> = ({ isVisible, onClose }) => (
  <FullWindow isVisible={isVisible} onClose={onClose}>
    <div className="about-content">
      <h1>Breathing</h1>
      <h2>About the application</h2>
      <p>
        The simplest web application that does just one basic thing — helps
        using the{" "}
        <a href="https://www.medicalnewstoday.com/articles/324417">
          4:7:8 breathing technique
        </a>
        . Once you have installed it, start the session, adapt your breathing to
        the rhythm, and relax.
      </p>
      <h2>Support</h2>
      <p>
        GitHub &mdash;{" "}
        <a href="https://github.com/jurijtokarski/breathing-app">
          jurijtokarski/breathing-app
        </a>
      </p>
      <p>
        Email &mdash;{" "}
        <a href="mailto:jurij@jurijtokarski.com">jurij@jurijtokarski.com</a>
      </p>
    </div>
  </FullWindow>
);

export default About;
