let apiUrl;
if (process.env.NODE_ENV === 'development') {
    apiUrl = 'https://tender-secure-bluegill.ngrok-free.app'; // 开发环境ngrok地址
} else {
    apiUrl = 'https://tender-secure-bluegill.ngrok-free.app'; // 这里需替换为实际生产环境API地址，若没变化还是ngrok地址
}
export default apiUrl;