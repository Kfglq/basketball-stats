// internal/handler/all_handlers.go
package handler

// AllHandlers 是一個容器，包含所有需要註冊路由的 Handler 實例
type AllHandlers struct {
	TeamHandler   *TeamHandler
	PlayerHandler *PlayerHandler
	// 💡 未來新增 Handler，只需在這裡新增欄位
	// UserHandler *UserHandler
}
