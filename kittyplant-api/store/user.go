package store

import "time"

// User is the main user model.
type User struct {
	ID        uint      `json:"id" gorm:"->;primaryKey"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
	Name      string    `json:"name" gorm:"index:,unique"`
	Password  string    `json:"password"`

	Relations []Relation `gorm:"foreignKey:UserID;references:ID"`
}

// GetUsers queries the database for all users.
func (d *Database) GetUsers(users *[]User) (err error) {
	if err = d.DB.Find(users).Error; err != nil {
		return err
	}

	return nil
}

// CreateUser creates a new user.
func (d *Database) CreateUser(user *User) (err error) {
	if err = d.DB.Create(user).Error; err != nil {
		return err
	}

	return nil
}

// UpdateUser creates a new user.
func (d *Database) UpdateUser(user *User) (err error) {
	if err = d.DB.Save(user).Error; err != nil {
		return err
	}

	return nil
}

// GetUser queries the database for all users.
func (d *Database) GetUser(user *User, id string) (err error) {
	if err = d.DB.First(user, id).Error; err != nil {
		return err
	}

	return nil
}

// GetUserByName queries the database for all users.
func (d *Database) GetUserByName(user *User, name string) (err error) {
	if err = d.DB.Where("name = ?", name).First(user).Error; err != nil {
		return err
	}
	return nil
}

// DeleteUser queries the database for all users.
func (d *Database) DeleteUser(user *User, id string) (err error) {
	if err = d.DB.Delete(user, id).Error; err != nil {
		return err
	}

	return nil
}
