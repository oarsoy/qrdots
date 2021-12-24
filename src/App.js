import "./styles.css";
import QRCode from "./qr";

export default function App() {
  return (
    <div className="App">
      <h1>Hello CodeSandbox</h1>
      <h2>Start editing to see some magic happen!</h2>
      <QRCode
        value="https://gbougakov.dev"
        logo="https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/320/apple/271/speech-balloon_1f4ac.png"
        logoBackgroundColor="#fff"
        size={600}
        logoSize={130}
        ecl="H"
        logoMargin={30}
        //randomDotSize={true}
      />
    </div>
  );
}
