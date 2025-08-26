# vue-create-api 文档

这是 vue-create-api 的官方文档，使用 VitePress 构建。

## 本地开发

### 安装依赖

```bash
pnpm install
```

### 启动开发服务器

```bash
pnpm docs:dev
```

文档将在 `http://localhost:2230` 启动。

### 构建文档

```bash
pnpm docs:build
```

### 预览构建结果

```bash
pnpm docs:preview
```

## 文档结构

```
docs/
├── .vitepress/
│   └── config.ts          # VitePress 配置
├── api/                   # API 文档
│   ├── index.md          # API 概述
│   ├── install.md        # install 函数
│   ├── use-component.md  # useComponent 函数
│   ├── create.md         # create 函数
│   └── types.md          # 类型定义
├── guide/                # 使用指南
│   ├── installation.md   # 安装指南
│   ├── basic-usage.md    # 基础用法
│   └── advanced.md       # 高级用法
├── examples/             # 示例代码
│   └── basic-dialog.md   # 基础弹窗示例
├── index.md              # 首页
└── README.md             # 本文档
```

## 贡献指南

1. Fork 项目
2. 创建功能分支
3. 提交更改
4. 推送到分支
5. 创建 Pull Request

## 许可证

MIT License
