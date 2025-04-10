import Header from '../components/Header'
import AddIcon from '@mui/icons-material/Add';
import "../styles/PlantsPage.css"

function PlantsPage() {

  const handleAddDevice = () => {
    console.log("Add device")
  }

  return (
    <div className="tmp-plant">
      <Header />
      <div className="plants-page">
        <h1>Plants Page</h1>
        <p>This is the plants page.</p>
        <button className='btn-add-device' onClick={handleAddDevice}><AddIcon/> Add device</button>
      </div>
    </div>
  );
}

export default PlantsPage;