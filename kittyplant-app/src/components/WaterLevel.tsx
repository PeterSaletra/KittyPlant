import waterLevel20 from '../assets/waterLevel20.png';
import waterLevel40 from '../assets/waterLevel40.png';
import waterLevel60 from '../assets/waterLevel60.png';
import waterLevel80 from '../assets/waterLevel80.png';
import waterLevel100 from '../assets/waterLevel100.png';
import '../styles/WaterLevel.css';

interface WaterLevelProps {
    waterLevel: number;
    name: string;
}

const WaterLevel: React.FC<WaterLevelProps> = ({ waterLevel, name }) => {
    return (
        <div className="water-level">
            <div className="water-level__container">
                <div className="water-level__level" />
                    {
                    waterLevel <= 20 ? (
                        <img src={waterLevel20} alt="Water Level 20%" className="water-level__image" />
                    ) : waterLevel <= 40 ? (
                        <img src={waterLevel40} alt="Water Level 40%" className="water-level__image" />
                    ) : waterLevel <= 60 ? (
                        <img src={waterLevel60} alt="Water Level 60%" className="water-level__image" />
                    ) : waterLevel <= 80 ? (
                        <img src={waterLevel80} alt="Water Level 80%" className="water-level__image" />
                    ) : (
                        <img src={waterLevel100} alt="Water Level 100%" className="water-level__image" />
                    )}
                    <p>Water Level: {waterLevel}%</p>
                    <h1>{name}</h1>
            </div>
        </div>
    );
}

export default WaterLevel;