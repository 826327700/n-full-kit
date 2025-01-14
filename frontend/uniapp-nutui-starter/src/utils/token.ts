
// 存储 Token 方法
export function setToken(token: string) {
	uni.setStorageSync('token', token);
}

// 读取 Token 方法
export function getToken() {
	return uni.getStorageSync('token');
}

// 清除 Token 方法
export function removeToken() {
	uni.removeStorageSync('token');
}
