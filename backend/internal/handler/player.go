// internal/handler/player.go
package handler

import (
	"errors"
	"net/http"
	"side/internal/service"
	"side/internal/utils"

	"github.com/gin-gonic/gin"
)

type PlayerHandler struct {
	playerService service.PlayerService
}

func NewPlayerHandler(s service.PlayerService) *PlayerHandler {
	return &PlayerHandler{playerService: s}
}

// GET /api/player/playerById
func (h *PlayerHandler) GetPlayerById(c *gin.Context) {
	player_id := c.Query("player_id")
	if player_id == "" {
		res := utils.ErrorRes(http.StatusBadRequest, errors.New("missing player_id"))
		c.JSON(http.StatusBadRequest, res)
		return
	}

	playerData, err := h.playerService.GetPlayerById(c.Request.Context(), player_id)
	if err != nil {
		res := utils.ErrorRes(http.StatusInternalServerError, err)

		c.JSON(http.StatusInternalServerError, res)
		return
	}
	res := utils.SuccessRes(playerData, "Player Data successfully retrieved.")
	c.JSON(http.StatusOK, res)
}
