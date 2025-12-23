// internal/router/router.go
package router

import (
	"side/internal/handler"

	"github.com/gin-gonic/gin"
)

func RegisterAPIRoutes(router *gin.Engine, h *handler.AllHandlers) {
	team := router.Group("/api/team")
	{
		team.GET("/allteams", h.TeamHandler.GetAllTeams)
		team.GET("/singleTeamById", h.TeamHandler.GetSingleTeamById)
	}
	player := router.Group("/api/player")
	{
		player.GET("/playerById", h.PlayerHandler.GetPlayerById)
	}
	// ----------------------

	// --- API Group V2 ---
	// v2 := router.Group("/api/v2")
	// {
	//     v2.GET("/products", h.ProductHandler.GetAllProducts)
	// }
}
