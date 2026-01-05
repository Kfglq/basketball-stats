// internal/handler/player_test.go
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

type MockPlayerSvc struct{ mock.Mock }

func (m *MockPlayerSvc) GetPlayerById(ctx context.Context, id string) (model.PlayerDetails, error) {
	args := m.Called(ctx, id)
	return args.Get(0).(model.PlayerDetails), args.Error(1)
}

func TestGetPlayerById_Handler(t *testing.T) {
	gin.SetMode(gin.TestMode)
	mockSvc := new(MockPlayerSvc)
	h := NewPlayerHandler(mockSvc)
	r := gin.Default()
	r.GET("/player", h.GetPlayerById)

	t.Run("Missing ID", func(t *testing.T) {
		w := httptest.NewRecorder()
		req, _ := http.NewRequest("GET", "/player", nil)
		r.ServeHTTP(w, req)
		assert.Equal(t, http.StatusBadRequest, w.Code)
	})

	t.Run("Valid ID", func(t *testing.T) {
		mockSvc.On("GetPlayerById", mock.Anything, "1").Return(model.PlayerDetails{Name: "LBJ"}, nil).Once()
		w := httptest.NewRecorder()
		req, _ := http.NewRequest("GET", "/player?player_id=1", nil)
		r.ServeHTTP(w, req)
		assert.Equal(t, http.StatusOK, w.Code)
	})
}
