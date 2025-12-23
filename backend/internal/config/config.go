package config

import (
	"fmt"
	"os"
	"strings"

	"github.com/joho/godotenv"
)

type Config struct {
	Protocol    string
	Host        string
	AppPort     string
	RoutePrefix string
	DBUrl       string
}

func getEnvDefault(key string, defaultValue string) string {
	if value, exists := os.LookupEnv(key); exists {
		return value
	}
	return defaultValue
}

// LoadConfig 負責載入配置
func LoadConfig() (*Config, error) {

	env := getEnvDefault("GO_ENV", "development")
	envFileName := fmt.Sprintf(".env.%s", env)

	if err := godotenv.Load(envFileName); err != nil {
		// 錯誤訊息換成英文
		fmt.Printf("INFO: Could not load %s. Falling back to system environment variables.\n", envFileName)
	} else {
		// 成功訊息換成英文
		fmt.Printf("INFO: Successfully loaded configuration from %s.\n", envFileName)
	}

	dbURL := os.Getenv("DB_URL")

	if dbURL == "" {
		dbHost := getEnvDefault("DB_HOST", "localhost")
		dbUser := os.Getenv("DB_USER")
		dbPassword := os.Getenv("DB_PASSWORD")
		dbName := os.Getenv("DB_NAME")
		dbPort := getEnvDefault("DB_PORT", "5432")
		dbSSLMode := getEnvDefault("DB_SSL_MODE", "disable")

		if dbUser == "" || dbPassword == "" || dbName == "" {
			return nil, fmt.Errorf("configuration error: DB_URL is not set, AND fallback DB_USER/PASS/NAME are missing")
		}

		dbURL = fmt.Sprintf("host=%s user=%s password=%s dbname=%s port=%s sslmode=%s TimeZone=Asia/Taipei",
			dbHost, dbUser, dbPassword, dbName, dbPort, dbSSLMode)
	}

	cfg := &Config{
		Protocol:    getEnvDefault("APP_PROTOCOL", "http"),
		Host:        getEnvDefault("APP_HOST", "localhost"),
		AppPort:     getEnvDefault("APP_PORT", "8080"),
		RoutePrefix: os.Getenv("APP_ROUTE_PREFIX"),
		DBUrl:       dbURL,
	}

	if cfg.RoutePrefix != "" && !strings.HasPrefix(cfg.RoutePrefix, "/") {
		cfg.RoutePrefix = "/" + cfg.RoutePrefix
	}

	return cfg, nil
}

func (c *Config) BaseURL() string {
	port := c.AppPort
	if (c.Protocol == "http" && port == "80") || (c.Protocol == "https" && port == "443") {
		port = ""
	} else {
		port = ":" + port
	}

	return fmt.Sprintf("%s://%s%s%s", c.Protocol, c.Host, port, c.RoutePrefix)
}
