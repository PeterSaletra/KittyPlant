package store

type Relation struct {
	ID       uint `gorm:"primaryKey" json:"id"`
	DeviceID uint `json:"device_id" gorm:"not null"`
	UserID   uint `json:"user_id" gorm:"not null"`
}

func (d *Database) AssignDeviceToUser(userID uint, deviceID uint) error {
	relation := Relation{
		UserID:   userID,
		DeviceID: deviceID,
	}
	if err := d.DB.Create(&relation).Error; err != nil {
		return err
	}
	return nil
}
