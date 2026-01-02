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

	Relations []Relation `gorm:"foreignKey:DeviceID;references:ID"`
}

func (d *Database) GetDevices(devices *[]Device) (err error) {
	if err = d.DB.Find(devices).Error; err != nil {
		return err
	}

	return nil
}

func (d *Database) GetDevicesAssignedToUser(devices *[]Device, userID uint) (err error) {
	if err = d.DB.Distinct().Preload("Plant").Joins("JOIN relations ON devices.id = relations.device_id").Where("relations.user_id = ?", userID).Find(devices).Error; err != nil {
		return err
	}

	return nil
}

func (d *Database) GetDevicesCountAssignedToUserID(userID uint) (count int64, err error) {
	if err = d.DB.Model(&Device{}).Joins("JOIN relations ON devices.id = relations.device_id").Where("relations.user_id = ?", userID).Count(&count).Error; err != nil {
		return 0, err
	}
	return count, nil
}

func (d *Database) CheckDeviceBelongsToUser(userID uint, deviceID string) (belongs bool, err error) {
	var count int64
	if err = d.DB.Model(&Device{}).
		Joins("JOIN relations ON devices.id = relations.device_id").
		Where("relations.user_id = ?", userID).
		Where("devices.device_name = ?", deviceID).
		Count(&count).Error; err != nil {
		return false, err
	}

	return count > 0, nil
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

func (d *Database) GetDeviceNamesByUserID(userID uint) (deviceNames []string, err error) {
	if err = d.DB.Model(&Device{}).
		Select("devices.device_name").
		Joins("JOIN relations ON devices.id = relations.device_id").
		Where("relations.user_id = ?", userID).
		Pluck("devices.device_name", &deviceNames).Error; err != nil {
		return nil, err
	}
	return deviceNames, nil
}

func (d *Database) DeleteDeviceByName(deviceID string) (err error) {
	// First, get the device to find its ID
	var device Device
	if err = d.DB.Where("device_name = ?", deviceID).First(&device).Error; err != nil {
		return err
	}

	// Delete all relations associated with this device
	if err = d.DB.Where("device_id = ?", device.ID).Delete(&Relation{}).Error; err != nil {
		return err
	}

	// Finally, delete the device itself
	if err = d.DB.Where("device_name = ?", deviceID).Delete(&Device{}).Error; err != nil {
		return err
	}

	return nil
}
