package store

type Device struct {
	ID       uint   `gorm:"primaryKey" json:"id"`
	DeviceID string `json:"device_id"`
	PlantID  uint   `json:"plant_id"`

	Plant     Plant      `gorm:"foreignKey:PlantID"`
	Data      []Data     `gorm:"foreignKey:DeviceID"`
	Relations []Relation `gorm:"foreignKey:DeviceID"`
}

// GetDevices queries the database for all devices.
func (d *Database) GetDevices(devices *[]Device) (err error) {
	if err = d.DB.Find(devices).Error; err != nil {
		return err
	}

	return nil
}

func (d *Database) GetDevicesAndWaterLevels(devices *[]Device) (err error) {
	if err = d.DB.Preload("Data").Preload("Plant").Find(devices).Error; err != nil {
		return err
	}
	return nil
}
