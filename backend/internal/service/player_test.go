// internal/service/player_test.go
package service

import (
	"context"
	"errors"
	"side/internal/model"
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/mock"
)

// Mock Repo
type MockPlayerRepo struct{ mock.Mock }

func (m *MockPlayerRepo) GetPlayerById(ctx context.Context, id string) (model.PlayerDetails, error) {
	args := m.Called(ctx, id)
	return args.Get(0).(model.PlayerDetails), args.Error(1)
}

func TestGetPlayerById(t *testing.T) {
	mockRepo := new(MockPlayerRepo)
	svc := NewPlayerService(mockRepo)

	t.Run("Success", func(t *testing.T) {
		data := model.PlayerDetails{Name: "LeBron"}
		mockRepo.On("GetPlayerById", mock.Anything, "1").Return(data, nil).Once()

		res, err := svc.GetPlayerById(context.Background(), "1")
		assert.NoError(t, err)
		assert.Equal(t, "LeBron", res.Name)
	})

	t.Run("Fail", func(t *testing.T) {
		mockRepo.On("GetPlayerById", mock.Anything, "2").Return(model.PlayerDetails{}, errors.New("db error")).Once()
		_, err := svc.GetPlayerById(context.Background(), "2")
		assert.Error(t, err)
	})
}
