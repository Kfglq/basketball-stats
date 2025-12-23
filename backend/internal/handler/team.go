// internal/handler/team.go
package handler

import (
	"errors"
	"net/http"
	"side/internal/service"
	"side/internal/utils"

	"github.com/gin-gonic/gin"
)

type TeamHandler struct {
	teamService service.TeamService
}

func NewTeamHandler(s service.TeamService) *TeamHandler {
	return &TeamHandler{teamService: s}
}

// GET /api/teams/allteams
func (h *TeamHandler) GetAllTeams(c *gin.Context) {
	teams, err := h.teamService.GetAllTeams(c.Request.Context())
	if err != nil {
		res := utils.ErrorRes(http.StatusInternalServerError, err)

		c.JSON(http.StatusInternalServerError, res)
		return
	}
	res := utils.SuccessRes(teams, "Team list successfully retrieved.")
	c.JSON(http.StatusOK, res)
}

// GET /api/teams/singleTeamById
func (h *TeamHandler) GetSingleTeamById(c *gin.Context) {
	id := c.Query("id")
	if id == "" {
		res := utils.ErrorRes(http.StatusBadRequest, errors.New("missing team id"))
		c.JSON(http.StatusBadRequest, res)
		return
	}

	singleTeam, err := h.teamService.GetSingleTeamById(c.Request.Context(), id)
	if err != nil {
		res := utils.ErrorRes(http.StatusInternalServerError, err)

		c.JSON(http.StatusInternalServerError, res)
		return
	}
	res := utils.SuccessRes(singleTeam, "Single Team Data successfully retrieved.")
	c.JSON(http.StatusOK, res)
}
