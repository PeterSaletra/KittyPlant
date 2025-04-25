package utils

import (
	"fmt"

	"golang.org/x/crypto/bcrypt"
)

const rounds = 14

func HashPassword(password string) (string, error) {
	bytes, err := bcrypt.GenerateFromPassword([]byte(password), rounds)
	if err != nil {
		return "", fmt.Errorf("bcrypt.GenerateFromPassword: %s", err)
	}
	return string(bytes), nil
}

func VerifyPasswordHash(password, hash string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(hash), []byte(password))
	return err == nil
}
