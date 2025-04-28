package store

type Relation struct {
	ID       uint `gorm:"primaryKey" json:"id"`
	DeviceID uint `json:"device_id" gorm:"not null"`
	UserID   uint `json:"user_id" gorm:"not null"`
}
