// pkg/security/jwt.go
package security

import (
	"fmt"
	"time"

	"github.com/golang-jwt/jwt/v5" // 推薦使用這個現代 JWT 庫
)

// 假設這是一個從配置載入的秘密金鑰
const SecretKey = "your-very-secret-key-please-change-it"

// Claims 結構體用於存放 JWT Payload 內容
type CustomClaims struct {
	UserID uint `json:"user_id"`
	jwt.RegisteredClaims
}

// GenerateToken 創建一個新的 JWT Token
func GenerateToken(userID uint) (string, error) {
	claims := CustomClaims{
		UserID: userID,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(time.Hour * 24)), // 24 小時過期
			IssuedAt:  jwt.NewNumericDate(time.Now()),
			Issuer:    "your-clean-arch-api",
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString([]byte(SecretKey))
}

// ValidateToken 解析並驗證 JWT Token
func ValidateToken(tokenString string) (*CustomClaims, error) {
	token, err := jwt.ParseWithClaims(tokenString, &CustomClaims{}, func(token *jwt.Token) (interface{}, error) {
		// 驗證簽名方法是否正確
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
		}
		return []byte(SecretKey), nil
	})

	if err != nil {
		return nil, err
	}

	// 驗證 Claims
	if claims, ok := token.Claims.(*CustomClaims); ok && token.Valid {
		return claims, nil
	}

	return nil, fmt.Errorf("invalid token")
}
