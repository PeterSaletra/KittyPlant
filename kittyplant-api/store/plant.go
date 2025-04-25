package store

type Plant struct {
	ID          uint   `gorm:"primaryKey" json:"id"`
	Name        string `gorm:"size:30" json:"name"`
	MinHydLevel int    `json:"min_hyd_level"`
	MaxHydLevel int    `json:"max_hyd_level"`

	Devices []Device `gorm:"foreignKey:PlantID"`
}

// GetPlants queries the database for all plants.
func (d *Database) GetPlants(plants *[]Plant) (err error) {
	if err = d.DB.Find(plants).Error; err != nil {
		return err
	}

	return nil
}
