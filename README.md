# chef-ai (frontend)

「智能菜谱助手」前端项目。围绕用户登录、口味偏好与食材库存管理，提供 AI 菜谱推荐与做法详情展示。

## 功能

- 账号体系：注册、登录、路由鉴权、登出
- 个性化设置：口味偏好、食材库存管理
- 菜谱推荐：一键生成推荐列表，支持历史记录
- 菜谱详情：食材清单、步骤、建议、图片占位
- 响应式布局：侧边栏 + 移动端抽屉菜单

## 技术栈

- Vue 3 + Vite
- Pinia、Vue Router
- Element Plus + Element Plus Icons
- Axios

## 快速开始

> Node 版本要求：`^20.19.0` 或 `>=22.12.0`

```sh
npm install
npm run dev
```

## 构建与预览

```sh
npm run build
npm run preview
```

## 后端与接口

前端通过 `/api` 访问后端接口：

- 默认开发代理：`/api` -> `http://localhost:8080`（见 `vite.config.js`）
- 生产环境建议：用 Nginx/网关将 `/api` 反向代理到后端服务

文档与设计文件：

- 需求与设计说明：`AI+菜谱.md`
- 接口文档：`OpenAPI.json`

## 相关仓库

- 后端仓库：`https://github.com/xy3082043438/chef-ai-server`
- 前端仓库：`https://github.com/xy3082043438/chef-ai`

## 项目结构

```
src/
  api/            接口封装与拦截器
  assets/         静态资源
  components/     通用组件
  router/         路由配置与鉴权
  stores/         Pinia 状态管理
  styles/         全局样式
  views/          页面（登录、首页、个性化、推荐、详情）
```

## 配置说明

- Axios 基础路径：`src/api/request.js`（当前为同源空字符串）
- 开发代理与允许访问域：`vite.config.js`
- 登录态：`localStorage` 保存 `token` 与 `user`

## 贡献指南

欢迎提交 Issue 和 PR：  
1. 先提 Issue 描述问题/需求  
2. Fork 后创建分支进行修改  
3. 提交 PR 并附上清晰说明  

## 许可证

本项目采用 MIT 许可证，详见 `LICENSE.md`。
