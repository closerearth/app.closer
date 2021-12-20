import './styles/tailwind.css';
import Card from './components/card';

function App() {
  return (
    <div className="App">
      <Card
        category="foo"
        title="I like bar"
        content="Some lonnnnnngggg text"
        // photo="/logo192.png"
      />
    </div>
  );
}

export default App;
