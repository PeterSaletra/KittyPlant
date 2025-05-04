package store

import (
	"fmt"

	"gorm.io/gorm"
)

type Plant struct {
	ID          uint   `gorm:"primaryKey" json:"id"`
	Name        string `gorm:"index:,unique" json:"name"`
	MinHydLevel int    `json:"min_hyd_level"`
	MaxHydLevel int    `json:"max_hyd_level"`
}

// GetPlants queries the database for all plants.
func (d *Database) GetPlants(plants *[]Plant) (err error) {
	if err = d.DB.Find(plants).Error; err != nil {
		return err
	}

	return nil
}

func (d *Database) AddPlant(plant *Plant) (err error) {
	// Check if the plant already exists
	var existingPlant Plant
	err = d.DB.Where("name = ?", plant.Name).First(&existingPlant).Error
	if err == nil {
		// Plant already exists
		return fmt.Errorf("plant with name '%s' already exists", plant.Name)
	} else if err != gorm.ErrRecordNotFound {
		// Some other error occurred
		return err
	}

	// Plant does not exist, proceed with insertion
	if err = d.DB.Create(plant).Error; err != nil {
		return err
	}

	return nil
}

func (d *Database) GetPlant(plant *Plant, plantName string) (err error) {
	if err = d.DB.Where("name = ?", plantName).First(&plant).Error; err != nil {
		return err
	}
	return nil
}
