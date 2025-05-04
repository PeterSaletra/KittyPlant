package store

type Device struct {
	ID         uint   `gorm:"primaryKey;column:id" json:"id"`
	DeviceName string `gorm:"column:device_name;type:text" json:"device_id"`
	Name       string `gorm:"column:name;type:text" json:"name"`

	Data      []Data     `gorm:"foreignKey:DeviceID;references:ID"`
	Relations []Relation `gorm:"foreignKey:DeviceID;references:ID"`
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

func (d *Database) AddDevice(deviceID string, device *Device) (err error) {
	if err = d.DB.Where("device_name = ?", deviceID).First(device).Error; err != nil {
		return err
	}

	if err = d.DB.Create(device).Error; err != nil {
		return err
	}

	return nil
}
