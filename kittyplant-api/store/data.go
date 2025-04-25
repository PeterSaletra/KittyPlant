package store

type Data struct {
	ID        uint `gorm:"primaryKey" json:"id"`
	DeviceID  uint `json:"device_id"`
	DataValue int  `json:"data_value"`

	Device Device `gorm:"foreignKey:DeviceID"`
}
