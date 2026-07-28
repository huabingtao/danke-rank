# 服务器端口与服务永久记忆指南 (Server Ports & Services Registry)

本文件永久记录服务器 `124.220.195.160` 上部署的所有项目端口与相关服务信息。

## 服务器基础凭据
- **服务器 IP**: `124.220.195.160`
- **SSH 用户名**: `ubuntu`
- **应用部署根目录**: `/home/ubuntu/apps`

---

## 项目与端口映射表 (Port Mapping)

| 端口号 (Port) | 服务 / 项目名称 | 运行方式 | 域名 / Nginx 反向代理配置 | 详细说明 |
| :---: | :--- | :--- | :--- | :--- |
| **`3001`** | **danke-rank** (弹壳排行榜) | PM2 (ID: 3) `node server.js` | `http://dankerank.guaguahub.cn` -> `127.0.0.1:3001` | Next.js Standalone 极简独立产物模式运行 |
| **`3005`** | **danke-tool-portal** (工具门户) | PM2 (ID: 1) `npm start -p 3005` | 直接通过端口访问 `124.220.195.160:3005` | Next.js 独立运行门户服务 |
| **`8003`** | **happy_ranch** (开心牧场) | PM2 (ID: 2) `node server.js` | 直接通过端口访问 `124.220.195.160:8003` | Node.js 应用服务 |
| **`80`** | **Nginx Web Server** | Nginx (v1.29.5) | 公网 HTTP 默认入口 | 代理 `dankerank.guaguahub.cn` 至端口 `3001` |
| **`22`** | **SSH 远程登录服务** | `sshd` 系统服务 | `ssh ubuntu@124.220.195.160` | 服务器命令行交互与代码打包部署端口 |
| **`8001`** | **Docker Proxy 1** | Docker 容器服务 1 | 容器映射端口 | 线上运行的微服务容器 1 |
| **`8002`** | **Docker Proxy 2** | Docker 容器服务 2 | 容器映射端口 | 线上运行的微服务容器 2 |

---

## 📌 预留后续架构优化路线 (Future Architectural Roadmap)

### 1. 对象存储 (COS / OSS) 图片资源托管迁移
- **需求概述**: 将目前存放在服务器 `/public/uploads/` 目录下的静态图片资源（二维码图片、特工头像、管理员上传图片等）全量托管至云对象存储服务（如腾讯云 COS / 阿里云 OSS）。
- **优势价值**:
  1. 避免消耗服务器本地磁盘空间；
  2. 结合云端 CDN 提供更快更稳定的图片加载速度；
  3. 防止无头或本地更新覆盖掉用户上传的图片文件。
- **实施策略**: 后续准备接入时，在 `/api/upload` 接口中引入腾讯云 COS SDK / 阿里云 OSS SDK，实现上传即直传云存储并返回 CDN URL。

---

## 规则指示
- 每次回答用户关于服务器端口或部署服务的询问时，优先参考此表格。
- 后续如有新增项目或更改端口，必须同步更新此文件。
- **Skill 软链接共享规范**：所有全局 Skill 均已统一沉淀安装在 `C:\Users\guagua\.gemini\config\skills\` 目录。其他 Agent 或具体项目如需引用，一律采用目录软链接 (Symlink / Junction) 方式连接，无需硬复制。

