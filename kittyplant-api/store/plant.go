package store

type Plant struct {
	ID          uint   `gorm:"primaryKey" json:"id"`
	Name        string `gorm:"size:30" json:"name"`
	MinHydLevel int    `json:"min_hyd_level"`
	MaxHydLevel int    `json:"max_hyd_level"`

	Devices []Device `gorm:"foreignKey:ID;references:ID"`
}

// GetPlants queries the database for all plants.
func (d *Database) GetPlants(plants *[]Plant) (err error) {
	if err = d.DB.Find(plants).Error; err != nil {
		return err
	}

	return nil
}

func (d *Database) AddPlant(plants *Plant) (err error) {
	if err = d.DB.Create(plants).Error; err != nil {
		return err
	}

	return nil
}

func (d *Database) AssignDeviceToPlant(plantName string, device *Device) (err error) {
	var plant Plant
	err = d.DB.Where("name = ?", plantName).First(&plant).Error
	if err != nil {
		return err
	}

	plant.Devices = append(plant.Devices, *device)
	return d.DB.Save(&plant).Error
}
