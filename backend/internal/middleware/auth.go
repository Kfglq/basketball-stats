// internal/middleware/auth.go
package middleware

import (
	"net/http"
	"strings"

	"side/pkg/security" // 引入我們定義的 JWT 函式

	"github.com/gin-gonic/gin"
)

// AuthMiddleware 是一個 Gin 中介軟體，用於驗證 JWT Token
func AuthMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		// 1. 從 Header 獲取 Token
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Authorization header required"})
			return
		}

		// 2. 檢查 Token 格式 (Bearer <token>)
		parts := strings.SplitN(authHeader, " ", 2)
		if len(parts) != 2 || strings.ToLower(parts[0]) != "bearer" {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Invalid Authorization header format"})
			return
		}
		tokenString := parts[1]

		// 3. 驗證 Token
		claims, err := security.ValidateToken(tokenString)
		if err != nil {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Invalid or expired token"})
			return
		}

		// 4. Token 有效，將用戶 ID 放入 Context，供後續 Handler 使用 (重要！)
		c.Set("user_id", claims.UserID)

		// 5. 繼續處理下一個 Handler
		c.Next()
	}
}
