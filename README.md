# ali-ogp

AliExpressのURLを展開し、OGP情報を表示するDiscordボットです。

## 機能

- AliExpressのURLからOGP（Open Graph Protocol）情報（タイトルや画像など）を抽出します。
- AliExpressのURLが検出されると、自動的にOGP情報をチャンネルに投稿します。

## 必要なもの

- [Bun](https://bun.sh/)
- [Node.js](https://nodejs.org/) (Discord.jsのために必要)

## インストール

1. このリポジトリをクローンします:
   ```bash
   git clone https://github.com/moezakura/ali-ogp.git
   cd ali-ogp
   ```

2. 依存関係をインストールします:
   ```bash
   bun install
   ```

3. サンプルファイルから`.env`ファイルを作成します:
   ```bash
   cp .env.example .env
   ```

4. `.env`ファイルにDiscordボットのトークンを設定します:
   ```
   DISCORD_TOKEN=your_discord_bot_token
   ```

## 使い方

ボットを実行するには:

```bash
bun run index.ts
```

ホットリロードを使用して開発モードで実行するには:

```bash
bun run dev
```

## Docker

Dockerを使用してこのボットを実行することもできます。

1. Dockerイメージをビルドします:
   ```bash
   docker build -t ali-ogp .
   ```

2. 環境変数を設定してDockerコンテナを実行します:
   ```bash
   docker run -d --env-file .env ali-ogp
   ```

## コントリビュート

コントリビュートを歓迎します！ Issueの作成やプルリクエストの送信を気軽に行ってください。
