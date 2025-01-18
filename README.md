# コーディングテンプレート_2023
## 推奨バージョン
node v21.1.0<br>
npm 10.2.0

## 初回インストール
_gulpフォルダに移動<br>
`cd _gulp`<br>
`npm i`

## 実行コマンド
開発用コマンド（css圧縮無し、css.mapを生成）<br>
`npm run server`<br>
本番用コマンド（css圧縮有り、css.mapを生成しない）<br>
`npm run build`

## その他注意
### gitignorefileについて
下記は初期値として除外している(サーバー側のwpテーマのダミー、及びcss.mapを除外想定です。)<br>
`_server/wp/wp-content/themes/dummy/`<br>
`*.map`

下記は案件に合わせて変更(hogeの箇所を適宜変更想定。案件によっては除外しなくてもよいです。)<br>
`#_server/wp/wp-content/themes/hoge/img/`<br>
`#_server/wp/wp-content/themes/hoge/css/`<br>
`#_server/wp/wp-content/themes/hoge/font/`<br>
`#_server/wp/wp-content/themes/hoge/js/`