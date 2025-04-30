package store

type Data struct {
	ID        uint `gorm:"primaryKey" json:"id"`
	DeviceID  uint `json:"device_id" gorm:"not null"`
	DataValue int  `json:"data_value" gorm:"not null"`
}
