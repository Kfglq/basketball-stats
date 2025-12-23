package main

import (
	"fmt"
	"log"
	"net/http"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/jmoiron/sqlx"
	_ "github.com/lib/pq"

	"side/internal/config"
	"side/internal/handler"
	"side/internal/repository"
	"side/internal/router"
	"side/internal/service"
)

func main() {
	// Load Configuration (Env)
	cfg, err := config.LoadConfig()
	if err != nil {
		log.Fatalf("Failed to load configuration: %v", err)
	}

	// Initialize Database Connection (*sqlxDB)
	sqlxDB, err := initDB(cfg)
	if err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}
	defer sqlxDB.Close() // Ensure connection is closed

	// Dependency Injection (DI) and Layer Assembly
	teamRepo := repository.NewTeamRepository(sqlxDB)
	teamService := service.NewTeamService(teamRepo)
	teamHandler := handler.NewTeamHandler(teamService)
	playerRepo := repository.NewPlayerRepository(sqlxDB)
	playerService := service.NewPlayerService(playerRepo)
	playerHandler := handler.NewPlayerHandler(playerService)

	allHandlers := &handler.AllHandlers{
		TeamHandler:   teamHandler,
		PlayerHandler: playerHandler,
	}

	ginRouter := initGinRouter(cfg, allHandlers)

	// Start HTTP Service
	serverAddr := fmt.Sprintf(":%s", cfg.AppPort)
	log.Printf("Server is running, accessible at %s\n", cfg.BaseURL())
	if err := ginRouter.Run(serverAddr); err != nil {
		log.Fatalf("Server failed to run: %v", err)
	}
}

// initDB establishes a standard *sqlx.DB connection
func initDB(cfg *config.Config) (*sqlx.DB, error) {
	// sqlx.Connect = sqlx.Open + db.Ping()
	db, err := sqlx.Connect("postgres", cfg.DBUrl)
	if err != nil {
		return nil, fmt.Errorf("connection failed: %w", err)
	}

	if err := db.Ping(); err != nil {
		db.Close()
		return nil, fmt.Errorf("database Ping failed: %w", err)
	}

	log.Println("Database connection successful (using database/sql)")
	return db, nil
}

func initGinRouter(cfg *config.Config, h *handler.AllHandlers) *gin.Engine {
	gin.SetMode(gin.ReleaseMode)
	ginRouter := gin.New()

	corsConfig := cors.DefaultConfig()
	corsConfig.AllowOrigins = []string{
		"http://localhost:3000",
		"https://basketball-stats-nine.vercel.app",
	}
	corsConfig.AllowMethods = []string{"GET", "POST"}
	corsConfig.AllowHeaders = []string{"Origin", "Content-Length", "Content-Type", "Authorization"}

	ginRouter.Use(cors.New(corsConfig))

	ginRouter.Use(gin.Logger(), gin.Recovery())

	ginRouter.GET("/health", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"status":    "UP",
			"service":   "Backend",
			"base_url":  cfg.BaseURL(),
			"host_port": fmt.Sprintf(":%s", cfg.AppPort),
		})
	})

	router.RegisterAPIRoutes(ginRouter, h)

	log.Println("Gin router initialized, API routes registered")
	return ginRouter
}
