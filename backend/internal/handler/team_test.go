// internal/handler/team_test.go
package handler

import (
	"context"
	"net/http"
	"net/http/httptest"
	"side/internal/model"
	"testing"

	"github.com/gin-gonic/gin"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/mock"
)

type MockTeamSvc struct{ mock.Mock }

func (m *MockTeamSvc) GetAllTeams(ctx context.Context) ([]model.Team, error) {
	args := m.Called(ctx)
	return args.Get(0).([]model.Team), args.Error(1)
}
func (m *MockTeamSvc) GetSingleTeamById(ctx context.Context, id string) (model.SingleTeam, error) {
	args := m.Called(ctx, id)
	return args.Get(0).(model.SingleTeam), args.Error(1)
}

func TestTeamHandler(t *testing.T) {
	gin.SetMode(gin.TestMode)
	mockSvc := new(MockTeamSvc)
	h := NewTeamHandler(mockSvc)
	r := gin.Default()
	r.GET("/teams", h.GetAllTeams)
	r.GET("/team", h.GetSingleTeamById)

	t.Run("GetAllTeams_OK", func(t *testing.T) {
		mockSvc.On("GetAllTeams", mock.Anything).Return([]model.Team{}, nil).Once()
		w := httptest.NewRecorder()
		req, _ := http.NewRequest("GET", "/teams", nil)
		r.ServeHTTP(w, req)
		assert.Equal(t, http.StatusOK, w.Code)
	})

	t.Run("GetSingleTeamById_NoID", func(t *testing.T) {
		w := httptest.NewRecorder()
		req, _ := http.NewRequest("GET", "/team", nil)
		r.ServeHTTP(w, req)
		assert.Equal(t, http.StatusBadRequest, w.Code)
	})
}
