# PromptLayer API 代理服务

这是一个用于代理访问 PromptLayer API 的服务，允许您通过兼容 OpenAI API 格式的接口来访问各种 AI 模型，包括 Claude 3.7、GPT-4.1、GPT-4o、GPT-4.5 以及 Gemini 2.5 等。

## 功能特点

- 兼容 OpenAI API 格式的接口
- 支持流式输出 (Streaming)
- 支持图像处理和上传
- 支持多账户轮询负载均衡
- Docker 容器化部署

## 支持的模型

- `claude-3-7-sonnet-20250219` - Anthropic Claude 3.7 Sonnet
- `claude-3-7-sonnet-20250219-thinking` - Claude 3.7 带思考过程版本
- `gemini-2.5-pro-preview-05-06` - Google Gemini 2.5 Pro
- `o4-mini` - OpenAI o4-mini
- `chatgpt-4o-latest` - OpenAI GPT-4o
- `gpt-4.1` - OpenAI GPT-4.1
- `gpt-4.5-preview` - OpenAI GPT-4.5 Preview

## 快速开始

### 前提条件

- Docker 和 Docker Compose
- PromptLayer 账号信息

### 部署步骤

1. 克隆代码仓库到本地

2. 配置环境变量

   在 `docker-compose.yml` 文件中设置两个重要参数：

   ```yaml
   environment:
     - COOKIES=your_account:your_password  # PromptLayer账号密码，账号密码用:隔开，多个账号用逗号分隔
     - AUTH_TOKEN=your_auth_token_here     # 设置API认证密钥，用于验证API调用
   ```

3. 启动服务

   ```bash
   docker-compose up -d
   ```

   或者直接使用预构建的镜像：

   ```bash
   docker run -d --name promptlayer-proxy -p 3000:3000 -e COOKIES=your_account:your_password -e AUTH_TOKEN=your_auth_token_here rfym21/promptlayer-proxy:latest
   ```

## API 使用方法

### 认证

在所有API请求中，需要在请求头中包含您设置的AUTH_TOKEN：

```
Authorization: Bearer your_auth_token_here
```

### 获取可用模型

```
GET http://localhost:3000/v1/models
```

### 发送聊天请求

```
POST http://localhost:3000/v1/chat/completions
```

请求体示例：

```json
{
  "model": "claude-3-7-sonnet-20250219",
  "messages": [
    {
      "role": "user",
      "content": "你好，请介绍一下自己"
    }
  ],
  "stream": true
}
```

### 图像处理

支持发送图像到模型，使用base64编码的图像或外部图像URL。

## 本地开发

如果您想在本地开发和测试：

1. 安装依赖

   ```bash
   npm install
   ```

2. 创建`.env`文件并设置账号和认证信息

   ```
   ACCOUNTS=your_account:your_password
   AUTH_TOKEN=your_auth_token_here
   ```

3. 启动开发模式

   ```bash
   npm run dev
   ```

## 注意事项

- 请确保您有有效的PromptLayer账号
- 多个账号设置可以实现负载均衡
- 所有API请求需要验证AUTH_TOKEN

## 技术栈

- Node.js + Express
- WebSocket (ws)
- Docker
- Axios
