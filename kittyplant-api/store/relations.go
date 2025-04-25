package store

type Relation struct {
	ID       uint `gorm:"primaryKey" json:"id"`
	DeviceID uint `json:"device_id"`
	UserID   uint `json:"user_id"`

	Device Device `gorm:"foreignKey:DeviceID"`
	User   User   `gorm:"foreignKey:UserID"`
}
