package store

import (
	"fmt"

	"gorm.io/gorm"
)

type Device struct {
	ID         uint   `gorm:"primaryKey;column:id" json:"id"`
	DeviceName string `gorm:"column:device_name;type:text" json:"device_id"`
	Name       string `gorm:"column:name;type:text" json:"name"`
	PlantID    uint   `gorm:"column:plant_id" json:"plant_id"`
	Plant      Plant  `gorm:"foreignKey:PlantID;references:ID"`

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

func (d *Database) GetDevicesAssignedToUser(devices *[]Device, userID uint) (err error) {
	if err = d.DB.Joins("JOIN relations ON devices.id = relations.device_id").Where("relations.user_id = ?", userID).Find(devices).Error; err != nil {
		return err
	}

	return nil
}

func (d *Database) AddDevice(deviceID string, device *Device) (err error) {
	if err = d.DB.Create(device).Error; err != nil {
		return err
	}

	return nil
}

func (d *Database) AssignPlantToDevice(plantName string, device *Device) (err error) {
	var plant Plant
	err = d.DB.Where("name = ?", plantName).First(&plant).Error
	if err != nil {
		if err == gorm.ErrRecordNotFound {
			return fmt.Errorf("plant '%s' does not exist", plantName)
		}
		return err
	}

	device.PlantID = plant.ID
	device.Plant = plant

	return d.DB.Save(device).Error
}
