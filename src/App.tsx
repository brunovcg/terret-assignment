import { DialogProvider } from "./dialogs/provider";
import "./styles/globalStyles.css";
import { StarWarsDashboard } from "./views/star-wars-dashboard/StarWarsDashboard";

function App() {
  return (
    <main id="main">
      <StarWarsDashboard />
      <DialogProvider />
    </main>
  );
}

export default App;
