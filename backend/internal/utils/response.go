// internal/utils/response.go
package utils

import (
	"net/http"
)

type Response struct {
	Status  int         `json:"status"`
	Message string      `json:"message"`
	Result  interface{} `json:"result"`
	Success bool        `json:"success"`
}

// SuccessRes 建立一個成功的回應結構
func SuccessRes(data interface{}, message string) Response {
	return Response{
		Status:  http.StatusOK,
		Message: message,
		Result:  data,
		Success: true,
	}
}

// ErrorRes 建立一個失敗的回應結構
func ErrorRes(status int, err error) Response {
	return Response{
		Status:  status,
		Message: err.Error(),
		Result:  nil,
		Success: false,
	}
}
