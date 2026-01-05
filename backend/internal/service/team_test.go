// internal/service/team_test.go
package service

import (
	"context"
	"side/internal/model"
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/mock"
)

type MockTeamRepo struct{ mock.Mock }

func (m *MockTeamRepo) GetAllTeams(ctx context.Context) ([]model.Team, error) {
	args := m.Called(ctx)
	return args.Get(0).([]model.Team), args.Error(1)
}
func (m *MockTeamRepo) GetSingleTeamById(ctx context.Context, id string) (model.SingleTeam, error) {
	args := m.Called(ctx, id)
	return args.Get(0).(model.SingleTeam), args.Error(1)
}

func TestTeamService(t *testing.T) {
	mockRepo := new(MockTeamRepo)
	svc := NewTeamService(mockRepo)

	t.Run("GetAllTeams_Success", func(t *testing.T) {
		mockRepo.On("GetAllTeams", mock.Anything).Return([]model.Team{{TeamID: "LAL"}}, nil).Once()
		res, err := svc.GetAllTeams(context.Background())
		assert.NoError(t, err)
		assert.Len(t, res, 1)
	})

	t.Run("GetSingleTeamById_Success", func(t *testing.T) {
		mockRepo.On("GetSingleTeamById", mock.Anything, "LAL").Return(model.SingleTeam{}, nil).Once()
		_, err := svc.GetSingleTeamById(context.Background(), "LAL")
		assert.NoError(t, err)
	})
}
