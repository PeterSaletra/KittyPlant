package utils

import (
	"crypto/tls"
	"crypto/x509"
	"fmt"
	"os"
	"path/filepath"
)

func LoadClientTLS(dir string) (*tls.Config, error) {
	caFile := filepath.Join(dir, "ca.crt")
	ca, err := os.ReadFile(caFile)
	if err != nil {
		return nil, err
	}
	roots := x509.NewCertPool()
	if !roots.AppendCertsFromPEM(ca) {
		return nil, fmt.Errorf("invalid CA certificate: %s", caFile)
	}

	certificate, err := tls.LoadX509KeyPair(
		filepath.Join(dir, "client.crt"),
		filepath.Join(dir, "client.key"),
	)
	if err != nil {
		return nil, err
	}
	return &tls.Config{
		RootCAs:      roots,
		Certificates: []tls.Certificate{certificate},
		MinVersion:   tls.VersionTLS12,
	}, nil
}
