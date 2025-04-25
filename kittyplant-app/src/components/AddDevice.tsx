// import { useState, useEffect } from 'react';

// function AddDevice() { 
//     const [newDeviceName, setNewDeviceName] = useState('');
//     const [newDevicePlant, setNewDevicePlant] = useState('');
//     const [plantsName, setPlantsName] = useState<string[]>([]);
//     const [isCustomPlant, setIsCustomPlant] = useState(false);
//     const [customPlantName, setCustomPlantName] = useState('');
//     const [customHydrationLevel, setCustomHydrationLevel] = useState('');const [customPlantName, setCustomPlantName] = useState('');
//     const [plantsName, setPlantsName] = useState<string[]>([]);

//     const handleModalClose = () => {
//         setIsModalOpen(false); // Close the modal
//       };
    
//       const handleSubmitNewDevice = () => {
//         // Example: Send new device data to the server
//         const newDevice = {
//           name: newDeviceName,
//           plant: newDevicePlant,
//           waterLevel: isCustomPlant ? customHydrationLevel : undefined,
//         };
//     return (
//         <div className="modal">
//             <div className="modal-content">
//                 <h2>ADD NEW DEVICE</h2>
//                 <label>
//                 DEVICE NAME
//                 <input
//                     type="text"
//                     value={newDeviceName}
//                     placeholder='DEVICE NAME'
//                     onChange={(e) => setNewDeviceName(e.target.value)}
//                 />
//                 </label>
//                 <label>
//                 PLANT
//                 <select
//                     value={newDevicePlant}
//                     onChange={(e) => setNewDevicePlant(e.target.value)}
//                     style={{ color: newDevicePlant ? 'black' : 'gray' }}
//                 >
//                     <option value="" style={{color : 'gray'}}>SELECT A PLANT</option>
//                     {plantsName.map((name, index) => (
//                     <option key={index} value={name}>
//                         {name}
//                     </option>
//                     ))}
//                 </select>
//                 </label>
//                 <label>
//                 <input 
//                     type="checkbox"
//                     checked={isCustomPlant}
//                     onChange={(e) => setIsCustomPlant(e.target.checked)}
//                 />
//                 ADD CUSTOM PLANT
//                 </label>
//                 {isCustomPlant && (
//                 <label>
//                     CUSTOM PLANT NAME
//                     <input
//                     type="text"
//                     value={customPlantName}
//                     placeholder='PLANT NAME'
//                     onChange={(e) => setCustomPlantName(e.target.value)} />
//                 </label><label>
//                     HYDRATION LEVEL
//                     <select
//                         value={customHydrationLevel}
//                         style={{ color: customHydrationLevel ? 'black' : 'gray' }}
//                         onChange={(e) => setCustomHydrationLevel(e.target.value)}
//                     >
//                         <option value="" disabled style={{ color: 'gray' }}>SELECT A HYDRATION LEVEL</option>
//                         <option value="LOW">Low</option>
//                         <option value="MEDIUM">Medium</option>
//                         <option value="HIGH">High</option>
//                     </select>
//                     </label>
//                 )}
//                 <div className="modal-actions">
//                 <button onClick={handleSubmitNewDevice}>SUBMIT</button>
//                 <button onClick={handleModalClose}>CANCEL</button>
//                 </div>
//             </div>
//             </div>
//     );
// }

// export default AddDevice;