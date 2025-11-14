package store

import "time"

type Data struct {
	ID            uint  `gorm:"primaryKey" json:"id"`
	DeviceID      uint  `json:"device_id" gorm:"not null"`
	WaterValue    int   `json:"water_value" gorm:"not null"`
	MoistureLevel int   `json:"moisture_level" gorm:"not null"`
	LastWatered   int64 `json:"last_watered" gorm:"not null"`
	CreatedAt     int64 `json:"created_at" gorm:"autoCreateTime"`
}

func (d *Database) AddDeviceData(data *Data) (err error) {
	if err = d.DB.Create(data).Error; err != nil {
		return err
	}
	return nil
}

func (d *Database) GetDeviceData(deviceID uint, data *[]Data, start time.Time, end time.Time) (err error) {
	if err = d.DB.Where("device_id = ?", deviceID).Where("created_at between ? and ?", start, end).Find(data).Error; err != nil {
		return err
	}
	return nil
}
